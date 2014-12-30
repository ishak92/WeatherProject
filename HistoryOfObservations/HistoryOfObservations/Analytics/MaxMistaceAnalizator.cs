using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Analytics
{
    class MaxMistaceAnalizator: Analyzer
    {
        public MaxMistaceAnalizator(ObservationHistory history) : base(history)
        {
        }

        public int GetMaximumMistaceForNDayPrediction(int numberOfDays)
        {
            int maxMist = 0;
            var predictionDate = History.GetFirstDate();
            var predictedDate = predictionDate.AddDays(numberOfDays);

            while (History.Contain(predictedDate))
            {
                var realTemp = History.getRealTempOfday(predictedDate);
                var predictedTemp = History.getPredictedTemp(predictionDate, numberOfDays);
                var mistake = Math.Abs(predictedTemp - realTemp);
                if (mistake > maxMist)
                    maxMist = mistake;
                predictedDate =  predictedDate.AddDays(1);
                predictionDate = predictionDate.AddDays(1);
            }
            return maxMist;
        }
    }
}
