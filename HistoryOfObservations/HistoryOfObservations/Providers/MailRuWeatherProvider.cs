using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using HtmlAgilityPack;

namespace HistoryOfObservations.Providers
{
    class MailRuWeatherProvider : IWeatherProvider
    {
        private string MailWeatherURL;

        public MailRuWeatherProvider(string url)
        {
            MailWeatherURL = url;
        }

        public DayliObservation GetDayliObservation()
        {
            HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
            doc.LoadHtml(getMailWeatherPageHTML());

            var Temperatures = doc.DocumentNode.SelectNodes(".//*[@class='day__temperature ']");

            var realTemp = getTempOfADayFromTempTagCollection(Temperatures, 0).getThreeTempStampsCenterOfInterval();
            var oneDayPred = getTempOfADayFromTempTagCollection(Temperatures, 1);
            var threeDayPred = getTempOfADayFromTempTagCollection(Temperatures, 3);
            var sevenDayPred = getTempOfADayFromTempTagCollection(Temperatures, 7);
            var nineDayPred = getTempOfADayFromTempTagCollection(Temperatures, 9);

            return new DayliObservation(realTemp, oneDayPred, threeDayPred, sevenDayPred, nineDayPred);

        }

        private ThreeTempIntervalStamps getTempOfADayFromTempTagCollection(HtmlNodeCollection tempers, int days)
        {
            var morningTemp = getTempFromMailString(tempers[4*days + 1].InnerText);
            var noonTemp = getTempFromMailString(tempers[4 * days + 2].InnerText);
            var eveningTemp = getTempFromMailString(tempers[4 * days + 3].InnerText);

            return new ThreeTempIntervalStamps(morningTemp, noonTemp, eveningTemp);
        }

        TempInterval getTempFromMailString(string tempString)
        {
            int sign = 1;
            if (tempString[0] == '-')
            {
                sign = -1;
                tempString = tempString.Substring(1);
            }
            if (tempString[0] == '+')
            {
                tempString = tempString.Substring(1);
            }

            tempString = tempString.Split('&')[0];  //TODO: fix govnocode
            int tempF = (int) float.Parse(tempString, NumberStyles.Number);

            tempF = tempF * sign;
            return new TempInterval(tempF, tempF);

        }

        private string getMailWeatherPageHTML()
        {
            if (MailWeatherURL.Contains("https:"))
                return getMailWeatherPageHTMLFromHTTP();
            else
                return getMailWeatherPageHTMLFromFILE();
        }

        private string getMailWeatherPageHTMLFromHTTP()
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(MailWeatherURL);
            httpWebRequest.Method = "GET";
            var Response = (HttpWebResponse)httpWebRequest.GetResponse();
            var steam = Response.GetResponseStream();
            var reader = new StreamReader(steam, Encoding.GetEncoding(Response.CharacterSet));
            return reader.ReadToEnd();
        }

        private string getMailWeatherPageHTMLFromFILE()
        {
            var httpWebRequest = (FileWebRequest)WebRequest.Create(MailWeatherURL);
            httpWebRequest.Method = "GET";
            var Response = (FileWebResponse)httpWebRequest.GetResponse();
            var steam = Response.GetResponseStream();
            var reader = new StreamReader(steam);
            return reader.ReadToEnd();
        }
    }
}
