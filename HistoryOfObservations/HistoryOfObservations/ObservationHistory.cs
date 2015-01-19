using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace HistoryOfObservations
{
    [Serializable()]
    public class ObservationHistory:ISerializable
    {
        private string name;
        private Dictionary<DateTime, DayliObservation> history;

        public ObservationHistory(string name)
        {
            this.name = name;
            this.history = new Dictionary<DateTime, DayliObservation>();
        }

        public int GetNumberOfObservations()
        {
            return history.Count;
        }
        public void AddObservation(DateTime date, DayliObservation observation)
        {
            if (history.ContainsKey(date.Date))
                throw new ThisDateAlreadyMeasuredException();
            else
                history.Add(date.Date, observation);
        }

        public DateTime GetFirstDate()
        {
            return history.Keys.Min();
        }

        public double getRealTempOfday(DateTime day)
        {
            if (history.ContainsKey(day.Date))
                return history[day.Date].GetRealTempOfNoon();
            else
                throw new NoSuchDayInHistoryException();
        }

        public TempInterval getPredictedTemp(DateTime predictionDate, int numberOfDays)
        {
            if (history.ContainsKey(predictionDate.Date))
                return history[predictionDate.Date].GetPrediction(numberOfDays);
            else
                throw new NoSuchDayInHistoryException();
        }

        public bool Contain(DateTime predictedDate)
        {
            return history.ContainsKey(predictedDate.Date);
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("history", this.history);
            info.AddValue("name", this.name);
        }

        public ObservationHistory(SerializationInfo info, StreamingContext context)
        {
            this.history = (Dictionary<DateTime, DayliObservation>) info.GetValue("history", typeof(Dictionary<DateTime, DayliObservation>));
            this.name = (string) info.GetValue("name", typeof (string));
        }

        public void SerializeToFile(string filename)
        {
            var stream = File.Open(filename + ".osl", FileMode.Open);
            var bformatter = new BinaryFormatter();
            bformatter.Serialize(stream, history);
            stream.Close();
        }

        public static ObservationHistory DeserializeFromFile(string filename)
        {
            var stream = File.Open(filename + ".osl", FileMode.OpenOrCreate);
            var bformatter = new BinaryFormatter();
            ObservationHistory history;
            if (stream.Length == 0)
                history = new ObservationHistory(filename);
            else
                history = (ObservationHistory)bformatter.Deserialize(stream);

            stream.Close();

            return history;
        }
    }
}
