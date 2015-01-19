using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public interface IWeatherProvider
    {
        DayliObservation GetDayliObservation();
    }
}
