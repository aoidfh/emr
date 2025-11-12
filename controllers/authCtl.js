"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbPool = require("../models/mysqlPool");
const ecode_1 = require("../config/ecode");
/* export default  */ class AuthCtl {
    constructor() {
    }
    // change password 로직 처리 : 인증확인, 새로운 비밀번호 저장
    // req, res를 받아서 처리하고,  결과에 따라 클라이언트로 결과 직접 전송도 가능.
    changePassword = async (userId, newPass) => {
        const [code, user] = await this.authenticate(userId, newPass);
        if (code !== ecode_1.default.OK) {
            return { message: 'Unauthorized' };
        }
        // save new password
    };
    /// 인증 체크 : 
    authCheck = async (req, res, next) => {
        //const _session:SessionData = req.session;
        const sessionKey = req.session.token;
        let _id = req.session?.user_id;
        if (!sessionKey) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        // 세션의 만료 시간 체크
        const sql = 'select * from sessions where session_id=?';
        const _sessionData = await dbPool.query(sql, [req.session.id]);
        const sessionExpires = _sessionData[0].expires;
        if (!sessionExpires || sessionExpires < Date.now() / 1000) {
            req.session?.destroy((err) => {
                if (err) {
                    console.error(err);
                }
            });
            return res.status(401).json({ error: 'Session expired' });
        }
        const user_id = req.session?.user_id;
        const role = req.session?.role;
        if (!user_id || !role) {
            return res.status(403).send({ message: 'Forbidden' });
        }
        // 권한이 있을 경우 요청 처리를 계속 진행
        next();
    };
    async authenticate(user_id, password) {
        try {
            // const query = 'SELECT * FROM tbl_account WHERE office_id = ? AND user_id = ?';
            // const users = await dbPool.query(query, [office_id, user_id]);
            const sql = `SELECT * from T_USER WHERE ID_USER='${user_id}';`;
            const users = await dbPool.getQuery(sql);
            if (users.length === 0) {
                return [ecode_1.default.ERR_FAIL_LOGIN, '해당 ID(이메일)로 등록된 사용자가 없습니다.'];
            }
            const user = users[0];
            //버퍼비교
            // const passwordIsValid = await bcrypt.compare(password, user.PW_USER_ENC)
            // if (!passwordIsValid) {
            //   return [ECODE.ERR_FAIL_LOGIN, '비밀번호가 일치하지 않습니다.'];
            // }
            if (password != user.PW_USER_ENC) {
                return [ecode_1.default.ERR_FAIL_LOGIN, '비밀번호가 일치하지 않습니다.'];
            }
            return [ecode_1.default.OK, user];
        }
        catch (error) {
            console.error('exception from authenicate()', error);
            return [ecode_1.default.ERR_FAIL, error];
        }
    }
    async GetData(query) {
        try {
            const data = await dbPool.getQuery(query);
            //console.log(data);
            return data; // 쿼리 결과 반환 (배열 형태)
        }
        catch (error) {
            console.error('exception from Test()', error, query);
            return [ecode_1.default.ERR_FAIL, error];
        }
    }
    async PostData(query, newData) {
        try {
            const data = await dbPool.query(query, newData);
            return data; // 쿼리 결과 반환 (배열 형태)
        }
        catch (error) {
            console.error('exception from Test()', error);
            console.error(newData);
            return [ecode_1.default.ERR_FAIL, error];
        }
    }
    close() {
        dbPool.close();
    }
}
;
exports.default = new AuthCtl();
//export default _Auth;
//# sourceMappingURL=authCtl.js.map