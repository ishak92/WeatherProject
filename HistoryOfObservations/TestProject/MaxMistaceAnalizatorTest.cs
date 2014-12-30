using HistoryOfObservations.Analytics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using HistoryOfObservations;
using HistoryOfObservations.Providers;

namespace TestProject
{
    
    
    /// <summary>
    ///This is a test class for MaxMistaceAnalizatorTest and is intended
    ///to contain all MaxMistaceAnalizatorTest Unit Tests
    ///</summary>
    [TestClass()]
    public class MaxMistaceAnalizatorTest
    {


        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize()]
        //public static void MyClassInitialize(TestContext testContext)
        //{
        //}
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion


        /// <summary>
        ///A test for GetMaximumMistaceForNDayPrediction
        ///</summary>
        [TestMethod()]
        [DeploymentItem("HistoryOfObservations.dll")]
        public void GetMaximumMistaceForNDayPredictionTest()
        {
            var history = new ObservationHistory();
            var initData = new DateTime(2014, 12, 1);
            var constMistakeWeatherGenerator = new ConstantMistakenWeatherProvider(5);
            for (int i = 0; i < 12; i++)
            {
                history.AddObservation(initData.AddDays((i)), constMistakeWeatherGenerator.GetDayliObservation());
            }
            var maxMistakeAnalyzer = new MaxMistaceAnalizator(history);


            var OneDayMaxMistake = maxMistakeAnalyzer.GetMaximumMistaceForNDayPrediction(1);
            var ThreeDayMaxMistake = maxMistakeAnalyzer.GetMaximumMistaceForNDayPrediction(3);
            var SevenDayMaxMistake = maxMistakeAnalyzer.GetMaximumMistaceForNDayPrediction(7);
            var TenDayMaxMistake = maxMistakeAnalyzer.GetMaximumMistaceForNDayPrediction(10);


            Assert.AreEqual(5, OneDayMaxMistake);
            Assert.AreEqual(5, ThreeDayMaxMistake);
            Assert.AreEqual(5, SevenDayMaxMistake);
            Assert.AreEqual(5, TenDayMaxMistake);

        }
    }
}
