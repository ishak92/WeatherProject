using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace HistoryOfObservations
{
    public class ThisDateAlreadyMeasuredException:  Exception
    {

    }

    public class NoSuchDayInHistoryException : Exception
    {
        
    }

    public class NoPredictionsForThisPeriod : Exception
    {
        private int numberOfDays;

        public NoPredictionsForThisPeriod(int days)
        {
            numberOfDays = days;
        }
    }
}
