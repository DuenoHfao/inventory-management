import { useAuthState } from "react-firebase-hooks/auth";
import { auth, dB } from "../firebase";
import { adminList } from "../extFunctions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { ManageAddNav } from "../templates/SiteNavBar";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";


export default function UserManage() {
    const [user, loading] = useAuthState(auth);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    async function getUser() {
        const query = await getDocs(collection(dB, "users"));
        const queryList = query.docs.map((doc) => {
            const data = doc.data();
            return {uid: doc.id, ...data};
        });
        setUserList(queryList);
    }

    async function handleDelete(e) {
        const deleteUserID = e.target.value;
        const deleteDatabaseUser = e.target.id;
        await deleteDoc(doc(dB, "users", deleteDatabaseUser));
        navigate("/userManage")
    }

    function DataList({id, permission, name, uid}) {
        let permission_string = "";
        
        for (let i=0;i<permission.length;i++) {
            permission_string = permission_string + permission[i] + "/";
        }

        return (
            <Row style={{margin: "auto",
                marginBottom: "1rem"
            }}>
                <Col>
                    <Card style={{
                        width: "auto"
                    }}>
                        <Card.Title style={{
                            textAlign: "center"
                        }}>{name}</Card.Title>
                        <Card.Text style={{
                            textAlign: "center"
                        }}>Permissions: {permission_string}</Card.Text>
                    </Card>
                </Col>
                <Col>
                    <Button id={uid}
                        value={id}
                        variant="danger"
                        onClick={handleDelete}>
                        Delete
                    </Button>
                </Col>
            </Row>
        )
    }

    const UserRow = () => {
        return userList.map((user) => {
            return <DataList id={user.userID}  name={user.userName} {...user} />
        })
    }

    useEffect(() => {
        if (loading) return;
        if (user) {
            const checkAdmin = adminList.includes(user.uid);
            if (!checkAdmin) {
                return navigate("/");
            }
            getUser();
        }
    }, [user, loading]); // not sure why it cannot have setIsAdmin function
    
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