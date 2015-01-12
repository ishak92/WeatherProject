using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class ThreeTempStamps
    {
        public TempInterval MorningTemp ;
        public TempInterval NoonTemp;
        public TempInterval EveningTemp;

        public ThreeTempStamps(TempInterval morningTemp, TempInterval noonTemp, TempInterval eveningTemp)
        {
            MorningTemp = morningTemp;
            NoonTemp = noonTemp;
            EveningTemp = eveningTemp;


        }

    }
}
