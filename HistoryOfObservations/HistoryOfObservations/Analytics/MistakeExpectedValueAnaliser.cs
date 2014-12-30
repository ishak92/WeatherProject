using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Analytics
{
    public class MistakeExpectedValueAnaliser: Analyzer
    {
        public MistakeExpectedValueAnaliser(ObservationHistory history) : base(history)
        {
        }

        public double GetMistakeExpectedValue(int NumberOfDays)
        {
            Dictionary<int, int> MistakeRandomValue = new Dictionary<int, int>();
            var predictionDate = History.GetFirstDate();
            var predictedDate = predictionDate.AddDays(NumberOfDays);

            while (History.Contain(predictedDate))
            {
                var realTemp = History.getRealTempOfday(predictedDate);
                var predictedTemp = History.getPredictedTemp(predictionDate, NumberOfDays);
                var mistake = Math.Abs(predictedTemp - realTemp);
                if (MistakeRandomValue.ContainsKey(mistake))
                    MistakeRandomValue[mistake]++;
                else
                    MistakeRandomValue.Add(mistake, 1);

                predictedDate = predictedDate.AddDays(1);
                predictionDate = predictionDate.AddDays(1);
            }
            return GetExpectedValueOfRandomValue(MistakeRandomValue);
        }

        double GetExpectedValueOfRandomValue(Dictionary<int, int> MistakeRandomValue)
        {
            double ExpectedValue = 0;
            int numberOfExperiments = getNumberOfPredictions(MistakeRandomValue);
            foreach (var mistake in MistakeRandomValue.Keys)
            {
                ExpectedValue += (double)mistake * (double)MistakeRandomValue[mistake] / (double)numberOfExperiments;
            }    
            return ExpectedValue;
        }

        int getNumberOfPredictions(Dictionary<int, int> MistakeRandomValue)
        {
            int count = 0;
            foreach (var mist in MistakeRandomValue.Values)
            {
                count += mist;
            }
            return count;
        }
    }
}
