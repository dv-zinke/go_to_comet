import {Container} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';import { DataGrid } from '@material-ui/data-grid';


function Main() {
    const [time, setTime] = useState();
    const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1uHlc51zRJ_imKwv5ENS4KLHoWoQc26pgQQehQ_8pids/gviz/tq?";
    useEffect(() => {
        console.log('컴포넌트가 화면에 나타남');
        getPost();
        return () => {
            console.log('컴포넌트가 화면에서 사라짐');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getPost() {
        axios.get(googleSheetUrl)
            .then(response => {
                const getData = JSON.parse(response.data.match(/(?<=.*\().*(?=\);)/s)[0]);
                const setData = getData.table.rows.map((row, i) => {
                    const date = new Date();
                    const time = row.c[0].f;
                    date.setHours(time.split(":")[0]);
                    date.setMinutes(time.split(":")[1]);
                    return {id: i, time:date.getTime(), originTime:time};
                });
                setTime(setData);
                getDate();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getDate = () => {
        if(time) {
            time.forEach(t =>{
                console.log((t.time - new Date().getTime()) / 60000, t.originTime)
            })
        }
    };

    return (
        <Container>
            <div>
                {time ?
                    <div style={{ height: 1000, width: '100%' }}>
                        <DataGrid
                            columns={[
                                { field: 'username', width: 200 },
                            ]}
                            rows={time.map(t => {
                                return {id: t.id,username: t.originTime}
                            })}
                        />
                    </div> : <CircularProgress/>}
            </div>
        </Container>
    )
}

export default Main;
