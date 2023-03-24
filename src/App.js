import './App.css';
import {Single, Double} from "./Panel";
import {useEffect, useState} from "react";


const nameFormUp=(name)=>name.replaceAll("-","_").replaceAll("_"," ").toUpperCase()
const timeSplit = (time)=>{
    if (time==null){return [null,null]}
    const timeValue = time.split(' ').slice(0, -1).join(' ')
    const timeUnit = time.split(' ')[time.split(' ').length-1]
    return [timeValue, timeUnit]
}


const titleFilter = (key)=>{
    return key.replace(/\s*back\s*/ig, "")
}
const subtitleFilter = (key)=>{
    console.log(key)
    return key.replace(/\s*PROVINCIAL\s*NOMINEES\s*/ig, "").replace(/\s*back\s*/ig, "").replace(/\s*CIT\s*/ig,"")
}
const timeFilter = (key)=>{
    if (key.toUpperCase().includes("No processing time".toUpperCase()))return null;
    if (timeSplit(key)[0]==="") return "? "+timeSplit(key)[1]
    return key.replace(/Part 1: /ig, "")
}
const singleFilter = (data)=>{
    return {
        title:titleFilter(data.title),
        subtitle:subtitleFilter(data.subtitle),
        time:timeFilter(data.time),
    }
}
const doubleFilter = (data)=>{
    return {
        title:titleFilter(data.title),
        subtitles:data.subtitles.map(subtitleFilter),
        times:data.times.map(timeFilter),
        double:true
    }
}
const Link = "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-non-country-en.json"
const Filters = ["study", "visitor", "provincial nominees", "citizenship", "pr", "caregivers"]
export const App = ()=>{

    const [lastUpdate, setLastUpdate] = useState("")
    const [data, setData] = useState([])
    const [filter, setFilter] = useState([])
    const [inputFilter, setInputFilter] = useState("")

  useEffect(()=>{
    fetch(Link)
        .then(response=>{
            response.json().then(json=>{
                setLastUpdate(json["default-update"]["lastupdated"])
                delete json["default-update"]
                const flatten=[]
                for (const key in json) {
                    let item = {}
                    if (Object.keys(json[key]).length===2){
                        const subKeys = Object.keys(json[key])
                        item = {
                            title:nameFormUp(key),
                            subtitles:subKeys.map(nameFormUp),
                            times:[json[key][subKeys[0]],json[key][subKeys[1]]],
                            double:true
                        }
                        flatten.push(item)

                    }else
                    for (const subKey in json[key]) {
                        item = {
                            title:nameFormUp(key),
                            subtitle:nameFormUp(subKey),
                            time:json[key][subKey],
                        }

                        if (Object.keys(json[key]).length===1){
                            item["subtitle"]=""
                        }
                        flatten.push(item)

                    }

                }
                setData(flatten)
            })

        })
  },[])

    console.log(data)
  return <>
      <div style={{textAlign:"center"}}>
          <h1>
              O🍁Visa
          </h1>
          <p >
              Last Update: {lastUpdate.toString()}
          </p>

          <p>Contains:
              <input style={{marginLeft:"0.5rem"}}  value={inputFilter} onChange={e=>setInputFilter(e.target.value)}/>
              {/* or*/}
              {/*{Filters.map(name=> <label form={name}><input type={"checkbox"} onChange={e=>{*/}
              {/*    if (e.target.checked){*/}
              {/*        setFilter(filter=>filter.filter(item=>item!==name))*/}
              {/*    }else {*/}
              {/*        setFilter(filter=>[...filter, name])*/}
              {/*    }*/}
              {/*}} />{name}</label>)}*/}

          </p>

      </div>
      <div style={{display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent: "space-around"}}>
          {data.map(item => {
              if (!item.title.match(new RegExp(inputFilter,"ig"))) return <></>
                  if (item.double){
                      item = doubleFilter(item)
                      return <Double
                          title={nameFormUp(item.title)}
                          subtitles = {item.subtitles.map(nameFormUp)}
                          times={item.times.map(timeSplit)}

                      />
                  }else {
                      item = singleFilter(item)

                      return <Single
                          title={nameFormUp(item.title)}
                          subtitle={nameFormUp(item.subtitle)}
                          time={timeSplit(item.time)}
                      />
                  }
              })}
      </div>

      <div style={{margin:"1rem", textAlign:"center"}}>
          data is from <a href={Link}>{Link}</a>
      </div>

  </>
}

export default App;
