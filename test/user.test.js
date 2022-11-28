// npm i --save-dev supertest
const request = require("supertest");

// supertest의 request에 app을 담아 활용하기 위해 createApp 함수를 불러옵니다.
const { createApp }  = require('../app');
const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

describe("Sign Up", () => {
  let app;

  beforeAll(async () => {
    // 모든 테스트가 시작하기 전(beforeAll)에 app을 만들고, DataSource를 이니셜라이징 합니다.
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    // 테스트 데이터베이스의 불필요한 데이터를 전부 지워줍니다.
    await myDataSource.query(`TRUNCATE users`);

    // 모든 테스트가 끝나게 되면(afterAll) DB 커넥션을 끊어줍니다.
    await myDataSource.destroy();
  });

  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/user/signup")
      .send({ 
        login_id: "justcode12", password: "123ksdaf2ss3", password_check: "123ksdaf2ss3", kor_name:"김코드", eng_name:"kimcode", country: "미국", email: "k3ji07061@justcode.kr", profile_image:"http://ddbdbddb.jpeg" 
      })
      .expect(201)
      .expect({ message: "userCreated" });
  });

  test("FAILED: not Same password", async () => {
    await request(app)
      .post("/user/signup")
      .send({ 
        login_id: "justcode", password: "123ksdaf2ss3", password_check: "123ksdaf2ss344", kor_name:"김코드", eng_name:"kimcode", country: "미국", email: "k3ji0706@justcode.kr", profile_image:"http://ddbdbddb.jpeg" 
      })
      .expect(400)
      .expect({ message: "PASSWORD_DONT_SAME" });
  });

  test("FAILED: invalid email", async () => {
    await request(app)
      .post("/user/signup") // HTTP Method, 엔드포인트 주소를 작성합니다.
      .send({ 
        login_id: "justcode", password: "123ksdaf2ss3", password_check: "123ksdaf2ss344", kor_name:"김코드", eng_name:"kimcode", country: "미국", email: "k3ji0706justcode.kr", profile_image:"http://ddbdbddb.jpeg" 
      })
      .expect(400)
      .expect({ message: 'EMAIL_INVALID' }); 
  });

  test("FAILED: PASSWORD_CHECK", async () => {
    await request(app)
      .post("/user/signup") // HTTP Method, 엔드포인트 주소를 작성합니다.
      .send({ 
        login_id: "justcode", password: "123k", password_check: "123k", kor_name:"김코드", eng_name:"kimcode", country: "미국", email: "k3ji0706@justcode.kr", profile_image:"http://ddbdbddb.jpeg" 
      })
      .expect(400)
      .expect({ message: 'PASSWORD_TOO_SHORT' }); 
  });

  test("FAILED: USER_NOT_EXIST", async () => {
    await request(app)
      .post("/user/login") // HTTP Method, 엔드포인트 주소를 작성합니다.
      .send({ login_id: "justcode101", password: "123ksdaf2ss3" })
      .expect(404)
      .expect({ message: 'USER_DOES_NOT_EXIST' }); 
  });
});

