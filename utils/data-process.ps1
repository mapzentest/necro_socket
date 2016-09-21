$SourceFilePath ='C:\Users\Truong.Nguyen\Downloads\stats.txt'
$properties = @{"path" ="'abc.tat'";
                'mode'= "add";
                'autorename' = "true"}
$arg = New-Object -TypeName PSObject -Prop $properties
#sWrite-Output $arg


<#
$arg ='{ "path": "' + '/aaa1.bbb' + '", "mode": "add", "autorename": true, "mute": false }'
 $authorization = "Bearer 6uT8iPrMZWwAAAAAAAAALVgDk6dobU149mBf7xyZZdFuE3olXQtd8fDt5x0It72V"
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", $authorization)
$headers.Add("Dropbox-API-Arg", $arg)
$headers.Add("Content-Type", 'application/octet-stream')
Invoke-RestMethod -Uri https://content.dropboxapi.com/2/files/upload -Method Post -InFile $SourceFilePath -Headers $headers
#>

function ConvertPSObjectToHashtable
{
    param (
        [Parameter(ValueFromPipeline)]
        $InputObject
    )

    process
    {
        if ($null -eq $InputObject) { return $null }

        if ($InputObject -is [System.Collections.IEnumerable] -and $InputObject -isnot [string])
        {
            $collection = @(
                foreach ($object in $InputObject) { ConvertPSObjectToHashtable $object }
            )

            Write-Output -NoEnumerate $collection
        }
        elseif ($InputObject -is [psobject])
        {
            $hash = @{}

            foreach ($property in $InputObject.PSObject.Properties)
            {
                $hash[$property.Name] = ConvertPSObjectToHashtable $property.Value
            }

            $hash
        }
        else
        {
            $InputObject
        }
    }
}

$arg ='{"path": "'+ '/stats.txt' + '"}'

#$authorization = "Bearer 6uT8iPrMZWwAAAAAAAAALVgDk6dobU149mBf7xyZZdFuE3olXQtd8fDt5x0It72V"
#$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
#$headers.Add("Authorization", $authorization)
#$headers.Add("Dropbox-API-Arg", $arg)
#$headers.Add("Content-Type", $null)
#Invoke-RestMethod -Uri https://content.dropboxapi.com/2/files/download -ContentType $null -Method Post -Headers $headers


$request = [System.Net.WebRequest]::Create("https://content.dropboxapi.com/2/files/download")
$request.Headers["Authorization"]= "Bearer 6uT8iPrMZWwAAAAAAAAAJqQ7SxCUIdPkidHXmbTq9PZyKGePBLv4n9c7EG3wcqq_";
$request.Method = "POST";
$request.Headers["Dropbox-API-Arg"]= $arg;

$resp = $request.GetResponse()
$reqstream = $resp.GetResponseStream()
$sr = new-object System.IO.StreamReader $reqstream
$result = $sr.ReadToEnd()

$json = $result | ConvertFrom-Json
$totals = $json.totals;

$hash = ConvertPSObjectToHashtable -InputObject $json.pokemons
$list =@()
$hash.Keys | % { $key = $_ ;
    $value =  $hash.Item($key)
    $rarity = 'Common'

    $item = New-Object -TypeName PSObject
    Add-Member -InputObject $item -MemberType NoteProperty -Name "PokemonId" -Value $value.Id
    Add-Member -InputObject $item -MemberType NoteProperty -Name "Name" -Value $key
    Add-Member -InputObject $item -MemberType NoteProperty -Name "Count" -Value $value.Count
    Add-Member -InputObject $item -MemberType NoteProperty -Name "Rate" -Value ($value.Count/$totals)
    Add-Member -InputObject $item -MemberType NoteProperty -Name "Rarity" -Value $rarity
    $list += $item
    #Write-Host $item
    }
$list = ($list | sort Rate -Descending)

$list | Export-Csv "rates.csv"
$list | ConvertTo-Json | Out-File "Rates.json"

$list | sort Rate -Descending | Format-Table 
