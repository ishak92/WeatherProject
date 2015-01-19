using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace HistoryOfObservations
{
    [Serializable()]
    public class ThreeTempStamps:ISerializable
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

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("morningTemp", morningTemp);
            info.AddValue("noonTemp", noonTemp);
            info.AddValue("eveningTemp", eveningTemp);
        }

        public ThreeTempStamps(SerializationInfo info, StreamingContext context)
        {
            morningTemp = (double) info.GetValue("morningTemp", typeof(double));
            noonTemp = (double)info.GetValue("noonTemp", typeof(double));
            eveningTemp = (double)info.GetValue("eveningTemp", typeof(double));
        }
    }
}
