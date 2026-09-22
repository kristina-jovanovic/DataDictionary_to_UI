using System.Diagnostics;
using System.IO;
using System.Text;
using System.Windows;
using Microsoft.Win32;
using DataDictionary.Analysis;
using DataDictionary.Parser.Parsing;
using DataDictionary.Parser.Parsing.Errors;
using DataDictionary.Transformation;
using DataDictionary.Transformation.Serialization;

namespace DataDictionary.WpfApp
{
    public partial class MainWindow : Window
    {
        private bool _launched;
        public MainWindow()
        {
            InitializeComponent();
        }

        // Ucitaj .dd fajl u editor
        private void LoadButton_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new OpenFileDialog
            {
                Filter = "Data Dictionary (*.dd)|*.dd|Svi fajlovi (*.*)|*.*"
            };
            if (dlg.ShowDialog() == true)
                InputEditor.Text = File.ReadAllText(dlg.FileName);
        }

        // Pokreni celu cev: parsiranje -> semantika -> transformacija -> JSON
        private void GenerateButton_Click(object sender, RoutedEventArgs e)
        {
            ErrorsList.Items.Clear();
            JsonOutput.Clear();

            // 1. parsiranje (sintaksne greske; model se gradi permisivno)
            var result = new DataDictionaryParserService().Parse(InputEditor.Text);
            if (!result.Success)
            {
                foreach (var err in result.Errors!)
                    ErrorsList.Items.Add($"[{ErrorTag(err.ErrorType)}] L{err.Line}:{err.Column}  {err.Message}");
                return;   // uslov za dalje korake je sintaksno ispravan model
            }

            // 2. semantika (skuplja SVE greske)
            var semanticErrors = new SemanticAnalyzer().Analyze(result.Model!);
            foreach (var err in semanticErrors)
                ErrorsList.Items.Add($"[Семантика] {err.Message}");

            // ako model ima semanticke greske, nije validan -> ne generisemo UI
            if (semanticErrors.Count > 0)
            {
                ErrorsList.Items.Add("Исправите семантичке грешке па поновите генерисање.");
                return;
            }

            // 3. transformacija + 4. serijalizacija u JSON
            try
            {
                var uiRoot = new UiModelBuilder().Build(result.Model!);
                JsonOutput.Text = UiModelJsonWriter.ToJson(uiRoot);
                ErrorsList.Items.Add("✓ Нема грешака — JSON успешно генерисан.");

                // 5. prosledi generisani JSON FormGenerator-u i otvori web + mobilnu
                OpenInFormGenerator(JsonOutput.Text);
            }
            catch (Exception ex)
            {
                ErrorsList.Items.Add($"[Трансформација] {ex.Message}");
            }
        }

        // Upisi generisani JSON u FormGenerator i otvori web + mobilnu aplikaciju
        private void OpenInFormGenerator(string json)
        {
            var formGen = FindFormGenerator();
            if (formGen == null)
            {
                ErrorsList.Items.Add("[FormGenerator] Фолдер 'FormGenerator' није пронађен.");
                return;
            }

            try
            {
                var target = Path.Combine(formGen, "projects", "demo", "src", "app", "generated.json");
                File.WriteAllText(target, json, new UTF8Encoding(false));
            }
            catch (Exception ex)
            {
                ErrorsList.Items.Add($"[FormGenerator] Упис generated.json: {ex.Message}");
                return;
            }

            if (_launched)
            {
                return;
            }

            try
            {
                // pokretanje web i mobilne aplikacije
                StartInDir(formGen, "npx ng serve demo -c mobile --open");
                _launched = true;
                ErrorsList.Items.Add("▶ Покренут дев-сервер (ng serve demo -c mobile). "
                    + "На телефону отвори http://<IP-рачунара>:4200");
            }
            catch (Exception ex)
            {
                ErrorsList.Items.Add($"[FormGenerator] Покретање: {ex.Message}");
            }
        }

        // Pokreni komandu u zadatom folderu u okviru cmd prozora
        private static void StartInDir(string workingDir, string command)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/k " + command,
                WorkingDirectory = workingDir,
                UseShellExecute = true
            });
        }

        // Pronadji folder FormGenerator
        private static string? FindFormGenerator()
        {
            var dir = new DirectoryInfo(AppContext.BaseDirectory);
            while (dir != null)
            {
                var candidate = Path.Combine(dir.FullName, "FormGenerator");
                if (Directory.Exists(candidate)) return candidate;
                dir = dir.Parent;
            }
            return null;
        }

        // Oznaka greske po tipu
        private static string ErrorTag(ErrorType type) => type switch
        {
            ErrorType.Semantic => "Семантика",
            ErrorType.Lexical => "Лексика",
            _ => "Синтакса"
        };

        // Sacuvaj generisani JSON u fajl
        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(JsonOutput.Text))
                return;

            var dlg = new SaveFileDialog
            {
                Filter = "JSON (*.json)|*.json",
                FileName = "izlaz.json"
            };
            if (dlg.ShowDialog() == true)
                File.WriteAllText(dlg.FileName, JsonOutput.Text);
        }
    }
}
