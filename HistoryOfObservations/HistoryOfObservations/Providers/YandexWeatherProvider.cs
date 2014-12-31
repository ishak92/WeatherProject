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
    class YandexWeatherProvider:IWeatherProvider
    {
        private string getYandexWeatherPageHTML()
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://m.pogoda.yandex.ru/?mode=short");
            httpWebRequest.Method = "GET";
            var Response = (HttpWebResponse)httpWebRequest.GetResponse();
            var steam = Response.GetResponseStream();
            var reader = new StreamReader(steam, Encoding.GetEncoding(Response.CharacterSet));
            return reader.ReadToEnd();
        }

        public DayliObservation GetDayliObservation()
        {

            HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
            doc.LoadHtml(getYandexWeatherPageHTML());

            HtmlNodeCollection NodesWithTemp = doc.DocumentNode.SelectNodes(".//*[@class='temp']");


            var realTemp = getTempOfADayFromTempTagCollection(NodesWithTemp, 0);
            var oneDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 1);
            var threeDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 3);
            var sevenDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 7);
            var nineDayPred = getTempOfADayFromTempTagCollection(NodesWithTemp, 9);

            return new DayliObservation(realTemp, oneDayPred, threeDayPred, sevenDayPred, nineDayPred);

        }

        ThreeTempStamps getTempOfADayFromTempTagCollection(HtmlNodeCollection tempTagCollection, int dayNum)
        {

            int morningTem = getTempFromYandexTempHtmlNode(tempTagCollection[dayNum*4]);
            int noonTemp = getTempFromYandexTempHtmlNode(tempTagCollection[dayNum * 4 +1]); ;
            int eveningTemp = getTempFromYandexTempHtmlNode(tempTagCollection[dayNum * 4 +2 ]); ;


            return new ThreeTempStamps(morningTem, noonTemp, eveningTemp);
        }

        int getTempFromYandexTempHtmlNode(HtmlNode node)
        {
            float tempF;
            int sign = 1;

            var TempString = node.InnerText.Replace("…", " ");
            TempString = TempString.Split(' ')[0];

            if (TempString[0] == '−')
            {
                sign = -1;
                TempString = TempString.Substring(1);
            }
            if (TempString[0] == '+')
            {
                sign = 1;
                TempString = TempString.Substring(1);
                
            }
            
            tempF = float.Parse(TempString, NumberStyles.Number);
            
            tempF = tempF*sign;
            tempF++;
            return (int)tempF;
        }
    }
}