const adminList = ["b6EnPmi8EaabnMTh97GgLKLZYqr1"];

export function checkAdmin(uid) {
    for (let i=0; i<adminList.length;i++){
        if (uid===adminList[i]){
            return true;
        } 
    }
    return false;
}