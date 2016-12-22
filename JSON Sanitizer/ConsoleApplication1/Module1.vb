Imports Newtonsoft.Json
Imports Newtonsoft.Json.Linq

Module Module1

	Sub Main()
		Dim FilePath = "C:\Users\aaron\Downloads\ConsoleApplication1\PriceList.json"
		Using file = IO.File.OpenText(FilePath), reader As New JsonTextReader(file)
			Dim JSON = JToken.ReadFrom(reader)
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
		End Using
	End Sub

End Module
