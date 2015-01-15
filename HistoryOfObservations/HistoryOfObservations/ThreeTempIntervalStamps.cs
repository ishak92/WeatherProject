using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ThreeTempIntervalStamps
    {
        public TempInterval MorningTemp ;
        public TempInterval NoonTemp;
        public TempInterval EveningTemp;

        public ThreeTempIntervalStamps(TempInterval morningTemp, TempInterval noonTemp, TempInterval eveningTemp)
        {
            MorningTemp = morningTemp;
            NoonTemp = noonTemp;
            EveningTemp = eveningTemp;


        }

    }
}
