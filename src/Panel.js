
export const Single = ({title, subtitle, time})=>{
    return <Border>
        <div style={{fontSize:"1.5rem"}}>{title}</div>
        <SubItem subtitle={subtitle} time={time} />
    </Border>
}



export const Double = ({title, subtitles, times}) =>{
    return <Border>
        <div style={{fontSize:"1.5rem"}}>{title}</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 2px 1fr"}}>

            <SubItem subtitle={subtitles[0]} time={times[0]} />
            <div style={{background:"black", height:"100%"}} />
            <div style={{marginLeft:"0.5rem"}}>
                <SubItem subtitle={subtitles[1]} time={times[1]} />
            </div>
        </div>
    </Border>
}

const Border = ({children})=>{
    return <div style={{
        border:"black 2px solid",
        borderRadius:"5px",
        width:"24rem",
        padding:"0.4rem"
    }}>
        {children}
    </div>
}

const SubItem = ({subtitle, time})=>{
    return <div>
        <div style={{fontSize:"1rem", height:"0.7rem"}}>{subtitle+""}</div>
        <span style={{fontSize:"4rem"}}>{time[0]??"?"}</span>
        <span style={{fontSize:"1.3rem"}}>{time[1]??""}</span>
    </div>
}
