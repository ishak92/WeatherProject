using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using HistoryOfObservations;
using HistoryOfObservations.Providers;

namespace TestProject
{
    [TestClass]
    public class UnitWeatherTest
    {
        [TestMethod]
        [ExpectedException(typeof(ThisDateAlreadyMeasuredException), "kakayato stroka")]
        public void TwoObservationsForOneDateIsNotAllowed()
        {
            var hist = new ObservationHistory("test observations");
            var randomProvider = new ConstantMistakenAndConstantRangeWeatherProvider(5, 5);
            hist.AddObservation(new DateTime(2014,12,1), randomProvider.GetDayliObservation() );
            hist.AddObservation(new DateTime(2014, 12, 1), randomProvider.GetDayliObservation());
            
        }

        [TestMethod]
        [ExpectedException(typeof(ThisDateAlreadyMeasuredException), "kakayato stroka")]
        public void TwoObservationsForOneDateWithDifferentTimesIsNotAllowed()
        {
            var hist = new ObservationHistory("test observation");
            var randomProvider = new ConstantMistakenAndConstantRangeWeatherProvider(5, 5);
            hist.AddObservation(new DateTime(2014, 12, 1), randomProvider.GetDayliObservation());
            hist.AddObservation(new DateTime(2014, 12, 1, 12, 12, 12), randomProvider.GetDayliObservation());

        }

        [TestMethod]
        public void FirstDateOfHistoryTest()
        {
            var hist = new ObservationHistory("test observation");
            var randomProvider = new ConstantMistakenAndConstantRangeWeatherProvider(5, 5);
            hist.AddObservation(new DateTime(2014, 12, 1), randomProvider.GetDayliObservation());
            hist.AddObservation(new DateTime(2014, 12, 2), randomProvider.GetDayliObservation());
            hist.AddObservation(new DateTime(2014, 11, 29), randomProvider.GetDayliObservation());

            Assert.AreEqual(new DateTime(2014, 11, 29), hist.GetFirstDate());

        }
    }
}
