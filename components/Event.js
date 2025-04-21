export default function Event({imgsrc, title, descr, going, date, starttime, endtime, timezone}) {
    return (
        <>
            <div className="event">
                <img src={imgsrc} alt={'none'}/>
                <h3>{title}</h3>
                <p>{descr}</p>
                <ul>
                    <li>{going}</li>
                    <li>{date}</li>
                    <li>{starttime + ' - ' + endtime}</li>
                    <li>{timezone}</li>
                 </ul>
            </div>
        </>
    );
}