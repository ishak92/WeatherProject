using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ThreeTempStamps
    {
        public int morningTemp;
        public int noonTemp;
        public int eveningTemp;


        public ThreeTempStamps(int morningTemp, int noonTemp, int eveningTemp)
        {
            this.morningTemp = morningTemp;
            this.noonTemp = noonTemp;
            this.eveningTemp = eveningTemp;
        }
    }
}
