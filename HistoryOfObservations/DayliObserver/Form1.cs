using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Windows.Forms;
using HistoryOfObservations;
using HistoryOfObservations.Providers;

namespace DayliObserver
{
    public partial class Form1 : Form
    {

        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            GetDailyObservsByUrl("https://pogoda.mail.ru/prognoz/moskva/14dney/", "MailPiter");
            GetDailyObservsByUrl("https://pogoda.mail.ru/prognoz/moskva/14dney/", "MailMoskva");
            GetDailyObservsByUrl("https://m.pogoda.yandex.ru/2/?mode=short", "YandexPiter");
            GetDailyObservsByUrl("https://m.pogoda.yandex.ru/?mode=short", "YandexMoskwa");
        }

        private void GetNumberOfObservationsInYandexMoskow()
        {
            var stream = File.Open("YandexMoskwa.osl", FileMode.Open);
            var bformatter = new BinaryFormatter();
            var history = (ObservationHistory)bformatter.Deserialize(stream);
            stream.Close();
            MessageBox.Show(history.GetNumberOfObservations().ToString());
            MessageBox.Show(history.GetFirstDate().ToString());
        }

        private IWeatherProvider providerFabricByURL(string url)
        {
            if(url.Contains("mail.ru"))
                return new MailRuWeatherProvider(url);
            if(url.Contains("yandex.ru"))
                return new YandexWeatherProvider(url);
            return null;                                    //TODO: fix govnocode
        }

        private void GetDailyObservsByUrl(string url, string name)
        {
            var history = HistoryOfObservations.ObservationHistory.DeserializeFromFile(name + ".osl");

            var provider = providerFabricByURL(url);
            history.AddObservation(DateTime.Now, provider.GetDayliObservation());

            history.SerializeToFile(name + ".osl");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            GetNumberOfObservationsInYandexMoskow();
        }


    }
}
