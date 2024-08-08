import { getDoc, doc, collection, where, getDocs, query, addDoc, updateDoc } from "firebase/firestore"
import { auth, dB } from "../firebase"
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { BookingNav } from "../templates/SiteNavBar";
import QRCode from "react-qr-code";
import { Container, Form } from "react-bootstrap";


export default function BookingPage() {

    const params = useParams();
    const id = params.id;
    const today = new Date();
    const [user, loading] = useAuthState(auth);
    const [currentUser, setCurrentUser] = useState("");
    const [userPermissions, setUserPermissions] = useState([]);
    const [itemClass, setItemClass] = useState([]);
    const [itemState, setItemState] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    

    async function getItem(id) {
        const query = await getDoc(doc(dB, "items", id));
        const queryData = query.data();
        setItemClass(queryData.itemClass);
        setItemState(queryData.itemState);
    }

    async function getUserPermissions() {
        const q = query(collection(dB, "users"), where("userID", "==", currentUser));
        const queryRes = await getDocs(q);
        queryRes.forEach((doc) => {
            const permList = doc.data().permission;
            setUserPermissions(permList);
        });
    }

    async function handleQRClick(e) {
        await addDoc(collection(dB, "logs"), {date: today, description: description, itemID: id, userID: currentUser});
        let setState = "";
        if (itemState == "inventory") {
            setState = "in-use";
        } else {
            setState = "inventory";
        }
        await updateDoc(doc(dB, "items", id), {itemState: setState})
        navigate("/");
    }

    function MakeQR() {
        for (let i=0; i<itemClass.length; i++) {
            for (let j=0; j<userPermissions.length; j++) {
                if (itemClass[i] == userPermissions[j]) {
                    return (
                            <QRCode id={id} value={id} 
                                onClick={handleQRClick} 
                                style={{
                                    cursor: "pointer"
                                }}/>
                    )
                }
            }
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        setCurrentUser(auth.currentUser.uid);
        getUserPermissions();
        getItem(id);
    }, [user, loading, currentUser]);

    return (
        <>
            <BookingNav />
            <Container style={{
                            marginTop: "1rem",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            <Form>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label style={{
                                        fontSize: "2rem",
                                        fontFamily: "system-ui"
                                    }}>Remarks</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Description of use."
                                        onChange={(text) => setDescription(text.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                            <MakeQR />
                        </Container>
        </>
    )
}