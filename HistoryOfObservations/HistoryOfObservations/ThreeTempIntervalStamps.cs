using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace HistoryOfObservations
{
    [Serializable()]
    public class ThreeTempIntervalStamps:ISerializable
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

        public ThreeTempStamps getThreeTempStampsCenterOfInterval()
        {
            return new ThreeTempStamps(MorningTemp.GetCenterOfInterval(),NoonTemp.GetCenterOfInterval(), EveningTemp.GetCenterOfInterval() );
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("MorningTemp", MorningTemp);
            info.AddValue("NoonTemp", NoonTemp);
            info.AddValue("EveningTemp", EveningTemp);

        }

        public ThreeTempIntervalStamps(SerializationInfo info, StreamingContext context)
        {
            MorningTemp = (TempInterval) info.GetValue("MorningTemp", typeof (TempInterval));
            NoonTemp = (TempInterval)info.GetValue("NoonTemp", typeof(TempInterval));
            EveningTemp = (TempInterval)info.GetValue("EveningTemp", typeof(TempInterval));
        }
    }
}
