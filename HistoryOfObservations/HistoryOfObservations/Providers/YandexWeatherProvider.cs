using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.IO;
using System.Web;
using System.Text;
using HtmlAgilityPack;

namespace HistoryOfObservations.Providers
{
    public class YandexWeatherProvider:IWeatherProvider
    {

        private string YandexWeatherURL;

        public YandexWeatherProvider()
        {
            YandexWeatherURL = "https://m.pogoda.yandex.ru/?mode=short";
        }
        public YandexWeatherProvider(string url)
        {
            YandexWeatherURL = url;
        }

        private string getYandexWeatherPageHTMLFromHTTP()
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(YandexWeatherURL);
            httpWebRequest.Method = "GET";
            var Response = (HttpWebResponse)httpWebRequest.GetResponse();
            var steam = Response.GetResponseStream();
            var reader = new StreamReader(steam, Encoding.GetEncoding(Response.CharacterSet));
            return reader.ReadToEnd();
        }

        private string getYandexWeatherPageHTMLFromFILE()
        {
            var httpWebRequest = (FileWebRequest)WebRequest.Create(YandexWeatherURL);
            httpWebRequest.Method = "GET";
            var Response = (FileWebResponse)httpWebRequest.GetResponse();
            var steam = Response.GetResponseStream();
            var reader = new StreamReader(steam);
            return reader.ReadToEnd();
        }

        private string getYandexWeatherPageHTML()
        {
            if (YandexWeatherURL.Contains("https:"))
                return getYandexWeatherPageHTMLFromHTTP();
            else
                return getYandexWeatherPageHTMLFromFILE();
        }

        public DayliObservation GetDayliObservation()
        {

            HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
            doc.LoadHtml(getYandexWeatherPageHTML());

            HtmlNodeCollection NodesWithTemp = doc.DocumentNode.SelectNodes(".//*[@class='temp']");


            var realTemp = getTempOfADayFromTempTagCollection(NodesWithTemp, 0).getThreeTempStampsCenterOfInterval(); // TODO: tut konechno obman luche brat 3 raza v den odno chislo i vse takoye.. no ne seychas
            var oneDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 1);
            var threeDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 3);
            var sevenDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 7);
            var nineDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 9);

            return new DayliObservation(realTemp, oneDayPred, threeDayPred, sevenDayPred, nineDayPred);

        }

        ThreeTempIntervalStamps getTempOfADayFromTempTagCollection(HtmlNodeCollection tempTagCollection, int dayNum)
        {

            var morningTem = getTempIntervFromYandexTempHtmlNode(tempTagCollection[dayNum*4]);
            var noonTemp = getTempIntervFromYandexTempHtmlNode(tempTagCollection[dayNum * 4 +1]); ;
            var eveningTemp = getTempIntervFromYandexTempHtmlNode(tempTagCollection[dayNum * 4 +2 ]); ;


            return new ThreeTempIntervalStamps(morningTem, noonTemp, eveningTemp);
        }

        TempInterval getTempIntervFromYandexTempHtmlNode(HtmlNode node)
        {
            
            var lowTempString = node.InnerText.Split('…')[0];
            var highTempString = node.InnerText.Split('…')[1];

            return new TempInterval(getTempFromYandexTempString(lowTempString), getTempFromYandexTempString(highTempString));
        }

        int getTempFromYandexTempString(string tempString)
        {
            int sign = 1;
            if (tempString[0] == '−')
            {
                sign = -1;
                tempString = tempString.Substring(1);
            }

            if (tempString[0] == '+')
            {
                sign = 1;
                tempString = tempString.Substring(1);
            }

            var tempF = float.Parse(tempString, NumberStyles.Number);

            tempF = tempF * sign;
            return (int)tempF;

        }
    }
}