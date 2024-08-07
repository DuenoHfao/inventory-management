import { useAuthState } from "react-firebase-hooks/auth";
import { auth, dB } from "../firebase";
import { adminList } from "../extFunctions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import { ManageAddNav } from "../templates/SiteNavBar";
import { getDocs, collection } from "firebase/firestore";

export default function UserManage() {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    async function getUser() {
        const query = await getDocs(collection(dB, "users"));
        const queryList = query.docs.map((doc) => {
            const data = doc.data();
            return {data};
        });
        setUserList(queryList);
    }

    function DataList({id, permission, name}) {

        return (
            <Card style={{
                width: "auto"
            }}>
                <Card.Title style={{
                    textAlign: "center"
                }}>{name}</Card.Title>
                <Card.Text style={{
                    textAlign: "center"
                }}>Permissions: {permission}</Card.Text>
            </Card>
        )
    }

    const UserRow = () => {
        return userList.map((user) => {
            const userData = user.data;
            return <DataList id={userData.userID} permission={userData.permission} name={userData.userName}/>
        })
    }

    useEffect(() => {
        if (loading) return;
        if (user) {
            const checkAdmin = adminList.includes(user.uid);
            setIsAdmin(checkAdmin);
            if (!checkAdmin) {
                return navigate("/");
            }
            getUser();
        }
    }, [user, loading]);
    
    return (
        <>
        <ManageAddNav />
            <Container style={{
                margin: "1rem",
                marginLeft: "auto",
                marginRight: "auto",
                width: "50%"
            }}>
                <UserRow />
            </Container>
        </>
    )
}