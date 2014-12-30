using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ObservationHistory
    {
        private Dictionary<DateTime, DayliObservation> history;

        public ObservationHistory()
        {
            this.history = new Dictionary<DateTime, DayliObservation>();
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

        public int getRealTempOfday(DateTime day)
        {
            if (history.ContainsKey(day.Date))
                return history[day.Date].GetRealTempOfNoon();
            else
                throw new NoSuchDayInHistoryException();
        }

        public int getPredictedTemp(DateTime predictionDate, int numberOfDays)
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
    }
}
