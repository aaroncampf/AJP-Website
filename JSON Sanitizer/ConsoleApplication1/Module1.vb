Imports Newtonsoft.Json
Imports Newtonsoft.Json.Linq

Module Module1

	Sub Main()
		Dim XML_Text = IO.File.ReadAllText("C:\Users\aaron\Downloads\PriceList.xml")
		XML_Text = XML_Text.Replace("<?xml version=""1.0"" encoding=""utf-8""?>" & vbCrLf, "")
		XML_Text = XML_Text.Replace("<Document", "<Document xmlns:json='http://james.newtonking.com/projects/json'")
		XML_Text = XML_Text.Replace("<CATG", "<CATG json:Array='true'")
		XML_Text = XML_Text.Replace("<Group", "<Group json:Array='true'")
		XML_Text = XML_Text.Replace("<Product", "<Product json:Array='true'")
		XML_Text = XML_Text.Replace("<SP", "<SP json:Array='true'")


		Dim doc = New Xml.XmlDocument()
		doc.LoadXml(XML_Text)
		Dim jsonText = JsonConvert.SerializeXmlNode(doc, Formatting.Indented, True)
		jsonText = jsonText.Replace("""@", """")

		Dim JSON = JToken.Parse(jsonText)
		Dim Random As New Random()

		For Each Item In JSON.SelectTokens("..Product")
			Dim Amount = Random.NextDouble() * Random.NextDouble() * 10

			If Item.GetType = GetType(JArray) Then
				For Each X In Item.Children
					X("LINECOST") = FormatCurrency(Amount)
					X("SELL1") = FormatCurrency(Amount * 1.7)
					X("SELL6") = FormatCurrency(Amount * 1.35)

					If X("SP") IsNot Nothing Then
						If TypeOf X("SP") Is JArray Then
							For Each SP In X("SP")
								SP("SP2") = "N/A"
								SP("SP7") = FormatCurrency(Amount * (1 + Random.NextDouble() / 4))
							Next
						Else
							X("SP")("SP2") = "N/A"
							X("SP")("SP7") = FormatCurrency(Amount * (1 + Random.NextDouble() / 4))
						End If
					End If
				Next
			Else
				Item("LINECOST") = FormatCurrency(Amount)
				Item("SELL1") = FormatCurrency(Amount * 1.7)
				Item("SELL6") = FormatCurrency(Amount * 1.35)

				If Item("SP") IsNot Nothing Then
					If TypeOf Item("SP") Is JArray Then
						For Each SP In Item("SP")
							SP("SP2") = "N/A"
							SP("SP7") = FormatCurrency(Amount * (1 + Random.NextDouble() / 4))
						Next
					Else
						Item("SP")("SP2") = "N/A"
						Item("SP")("SP7") = FormatCurrency(Amount * (1 + Random.NextDouble() / 4))
					End If
				End If
			End If
		Next

		Using NewFile = IO.File.CreateText("C:\Users\aaron\Documents\GitHub\AJP-Website\AJP Website\Demo Data\PriceList.json"),
				  writer As New JsonTextWriter(NewFile)

			writer.Formatting = Formatting.Indented
			JSON.WriteTo(writer)
		End Using
	End Sub

End Module
