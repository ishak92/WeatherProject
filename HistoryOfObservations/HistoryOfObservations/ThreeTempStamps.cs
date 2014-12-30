using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ThreeTempStamps
    {
        public int MorningTemp ;
        public int NoonTemp;
        public int EveningTemp;

        public ThreeTempStamps(int morningTemp, int noonTemp, int eveningTemp)
        {
            MorningTemp = morningTemp;
            NoonTemp = noonTemp;
            EveningTemp = eveningTemp;


        }

    }
}
