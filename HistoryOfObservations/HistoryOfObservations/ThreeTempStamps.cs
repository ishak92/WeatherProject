using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ThreeTempStamps
    {
        public double morningTemp;
        public double noonTemp;
        public double eveningTemp;


        public ThreeTempStamps(double morningTemp, double noonTemp, double eveningTemp)
        {
            this.morningTemp = morningTemp;
            this.noonTemp = noonTemp;
            this.eveningTemp = eveningTemp;
        }
    }
}
