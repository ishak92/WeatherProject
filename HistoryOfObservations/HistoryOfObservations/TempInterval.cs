using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace HistoryOfObservations
{
    [Serializable()]
    public class TempInterval:ISerializable
    {
        public int low;
        public int high;

        public TempInterval(int low, int high)
        {
            this.low = low;
            this.high = high;
        }

        int GetLengthOfInterval()
        {
            return high - low;
        }

        public double GetCenterOfInterval()
        {
            return (low + high)/2.0;
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("low", low);
            info.AddValue("high", high);
        }

        public TempInterval(SerializationInfo info, StreamingContext context)
        {
            low = (int) info.GetValue("low", typeof(int));
            high = (int) info.GetValue("high", typeof(int));
        }
    }
}
