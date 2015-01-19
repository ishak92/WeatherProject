using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Web.Script;
using HistoryOfObservations;
using HistoryOfObservations.Providers;

namespace SerializationTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var curDir = Directory.GetCurrentDirectory();
            curDir += "\\..\\..\\..\\TestData\\Mail.ru\\Day1\\1.html";
            var provider = new MailRuWeatherProvider(curDir);

            var dayliObs = provider.GetDayliObservation();

            var history = new ObservationHistory("test observation");
            history.AddObservation(DateTime.Now, dayliObs);

            
            Stream stream = File.Open("EmployeeInfo.osl", FileMode.Create);
            BinaryFormatter bformatter = new BinaryFormatter();
            Console.WriteLine("Writing Employee Information");
            bformatter.Serialize(stream, history);
            stream.Close();

            history = null;

            stream = File.Open("EmployeeInfo.osl", FileMode.Open);
            bformatter = new BinaryFormatter();

            Console.WriteLine("Reading Employee Information");
            history = (ObservationHistory)bformatter.Deserialize(stream);
            stream.Close();
        }
    }
}
