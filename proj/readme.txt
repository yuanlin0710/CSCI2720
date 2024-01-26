// I declare that the lab work here submitted is original except for source material explicitly acknowledged,
// and that the same or closely related material has not been previously submitted for another course.
// I also acknowledge that I am aware of University policy and regulations on honesty in academic work, and of the disciplinary guidelines and procedures applicable to breaches of such
// policy and regulations, as contained in the website.
// University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/
// Student Name : LI Heming, PAN Yuchen, YUAN Lin, XU Xinyi, KONG Deyuan
// Student ID : 1155157266, 1155173729, 115515726, 1155141399, 1155173854, 1155141454
// Class/Section : CSCI2720
// Date : Dec 14, 2023
Group17 instruction
1. Use the following commands to install the necessary modules:
npm i react-scripts
npm i react-router-dom
npm i react-leaflet
npm i leaflet
npm i react
npm i react-dom
npm i bootstrap
npm i express cors
npm i mongoose

Or use npm start to install all.

2. Created a folder named db, which is used to be the path for mongoDB database.

3. Use the following command to start MongoDB:
(Make sure the mongod command can be used in the terminal)
mongod —dbpath=db

4.open compass and connect to the following url:
mongodb://localhost:27017

5. Go to the server folder of our project, and run the following command to open the server on http://localhost:3001:
node server.js

6. Refresh mongoDB compass and you will see a database named project.

7. Import json file to mongoDB under public folder. You should match each json file with their corresponding collection in MongoDB compass.

8. npm start. Run the client on http://localhost:3000 and you will redirect to the login webpage

9. To login with admin, use the following username and password:
Username: admin
password: password

10. Click on the event database to view all the events. 
You can create new events by clicking on create new. After creating, click on the buttons above to navigate to other places.

11. Click on the user database to view all the existing users. 
You can create, update and delete. There is no restrictions for the password choice, and you can choose whatever you want. 
*Please do not change the username of admin.

12. Click on log out.

13. Enter any other username-password set will log you in to the user page. For you reference, you can use:
username: user
passord: password

14. Inside user page, refer to the project report to know how to use each function. 
