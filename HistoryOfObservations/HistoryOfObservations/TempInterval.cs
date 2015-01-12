using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class TempInterval
    {
        public int low;
        public int high;

        int GetLengthOfInterval()
        {
            return high - low;
        }

        double GetMidleOfInterval()
        {
            return (low + high)/2.0;
        }
    }
}
