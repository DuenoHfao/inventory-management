import { collection, doc, getDoc, getDocs, where, query } from "firebase/firestore";
import { auth, dB } from "../firebase";
import { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { adminList } from "../extFunctions";
import { LoggingNav } from "../templates/SiteNavBar";

export default function LogsPage() {
    const [user, loading] = useAuthState(auth);
    const [pastLogs, setPastLogs] = useState([]);
    const navigate = useNavigate();

    function inefficientSort(arr) {
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arr.length-1-i; j++) {
                if (arr[j].date.seconds > arr[j + 1].date.seconds) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        return arr;
    }

    async function getUserName(docData) {
        let borrowedUserName = "";
        const borrowedUserID = docData.userID;
        const q = query(collection(dB, "users"), where("userID", "==", borrowedUserID));
        const queryRes = await getDocs(q);
        queryRes.forEach((user) => {
            borrowedUserName = user.data().userName;
        })
        return borrowedUserName;
    }

    async function getItemName(docData) {
        const borrowedItemID = docData.itemID;
        const queryRes = await getDoc(doc(dB, "items", borrowedItemID));
        return queryRes.data().itemName;
    }

    async function getLogs() {
        const logsQuery = await getDocs(collection(dB, "logs"));
        const indvLogs = await Promise.all(logsQuery.docs.map(async (doc) => {
            const docData = doc.data();
            try{
                let userName = "";
                getUserName(docData).then((result) => {
                    userName = result
                });
                const itemName = await getItemName(docData);
                return {itemName: itemName, userName: userName, ...docData};
            } catch {}
        }));
        return inefficientSort(indvLogs);
    }
        
    

    function DisplayLogs({userName, itemName, date, description}){
        const dateInMilliseconds = date.seconds * 1000;
        const currentDate = new Date(dateInMilliseconds);
        const [year, month, day, hours, minutes, seconds] = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()];
        const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedDate = `${year} ${monthList[month-1]} ${day} @ ${hours}:${minutes}:${seconds}, UTC+8`
        return (
            <Card style={{padding: "0.5em",
                margin: "1rem",
                marginLeft: "auto",
                marginRight: "auto",
                width: "50%"
            }}>
                <Card.Title>{itemName} used by {userName}</Card.Title>
                <Row>
                    <Col>
                        <Card.Text>{formattedDate}</Card.Text>
                    </Col>
                    <Col>
                    <Card.Text>Remarks: {description}</Card.Text>
                    </Col>
                </Row>
            </Card>
        )
    }

    function LogDetails() {
        return pastLogs.map((logDetails) => {
            return <DisplayLogs {...logDetails} />
        })
    }

    useEffect(() => {
        if (loading) return;
        if (user) {
            const checkAdmin = adminList.includes(user.uid);
            if (!checkAdmin) {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
        getLogs().then((returnedLogs) => {
            setPastLogs(returnedLogs);
        });
    }, [user, loading])

    return (
        <>
            <LoggingNav />
            <Container style={{alignContent: "center"}}>
                <h1 style={{textAlign: "center"}}>Logs</h1>
                <LogDetails />
            </Container>
        </>
    )
}