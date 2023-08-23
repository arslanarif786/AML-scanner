<a ref="https://github.com/Developers-Studio-Limited/Merchant-Service/blob/merchant_portal_backend/documents/assets/asl.png"  >
   <img src="https://github.com/Developers-Studio-Limited/Merchant-Service/blob/merchant_portal_backend/documents/assets/asl.png"  width="200px" align="right">
</a>

# AML

## Introduction
<hr>
The purpose of the ASL is to help the merchants gather all the data of the different criminals/exposed entities in one place through the smooth process of web scraping. Actually, all the data against criminals or exposed entities is present on the web in scattered form. The goal of this project is to gather all that information in one place so that there is no need for a user to search different websites or sources to collect the particular data. Users can search for a specific criminal/exposed entity and if there is any record present in our sources, ASL will generate a detailed report of that person which a user can easily download.
<br>
<br>
<br>

## Table of Contents

  <ol>
    <li>
     <a href="#project-overview">Project Overview - Explanation of Business Idea</a>
    </li>
     <li>
      <a href="#buisness-document-link">
     Business Document Link
     </a>
    </li>
    <li>
    <a href="#srs-document-link">SRS Document Link</a>
    </li>
        <li>
       <a href="#frontend">Frontend</a>
      <ul>
        <li> <a href="#stack-used-frontend">Stack Used</a></li>
        <li><a href="#installation-procedure-frontend">Installation Procedure</a></li>
        <li><a href="#directory-structure-frontend">Directory Structure - Frontend</a></li>
        <li> <a href="#third-party-integrations-frontend">Third Party Integrations and External Packages</a></li>
        <li><a href="#figma-ui-link">Figma UI Link</a></li>
        <li><a href="#external-packages-frontend">External Packages</a></li>
      </ul>
    </li>

  </ol>

# Merchant Portal:

### Project Overview - Explanation of Buisness Idea
<hr>
This service allows the merchant to view all of the system's searches. The merchant would be able to see which searches were carried out, when they were carried out.
It will provide the merchant with a quick search option, allowing the merchant to search AML based on the parameters defined: Entity/Business Name, Birth/Incorporation Date, Country, and Category, with the entity/business name field required and the other fields optional. To do the search, the merchant would be able to select multiple parameters from the given list.
Furthermore, the merchant will be able to update API and secret keys via this service. It also allows the merchant to change the password, enable or disable two-factor authentication, and create various secondary users with specified roles and rights.


### Buisness Document Link

https://drive.google.com/file/d/1g11wmVbtvzcUOO7hXErSLp6y49jBPutG/view?usp=sharing

### SRS Document Link

https://drive.google.com/file/d/1sbVVmK48AKPmawEALbYg9xH3WB-QS4qo/view?usp=sharing

<hr>

### The Merchant portal will have 3 main tabs:

1. Searches
2. Quick Search
3. Users management
4. Settings
5. Developers Hub

### Searches

Under the searches tab, we’ll have all the searches made by the merchant. It will have the keyword searched by the merchant, the date and time it was searched.

### Quick Search

The merchant can find the reports or test the merchant API from his portal.The quick search tab will show the data from both manually added reports and crawled data. He can search reports using the following filters:

- Entity/Business Name
- Birth/Incorporation Date
- Countries
- Categories
- Fuzziness

### User Management

Under the user management tab, we’ll have two sub-tabs:

1. All Users
2. Roles and Permissions

#### 1. All Users

- All the users would be shown in the list view with all their details. Two icons will be displayed: Edit Role and

- Edit Role: The Edit Role dialogue box will appear, allowing the user to change and update any field.

- View Details: When you click the "view details" icon, all of the user’s other details will be displayed.

- All the users would be shown in the list view, with all their details. Two icons will be displayed: Edit User and View Details
- When the user clicks the "Create User" button, a form appears, allowing them to create a new user by filling in the required fields.

### Invite new users:

The Admin can send invites to new users. The admin will provide the email and role of that user, and an invite link will be sent to that email. After clicking the link in the email, the user will set up his basic details and password and can access the Agent Backoffice.
<br>
There will be a login screen where the agent can enter their credentials and log in.

<hr>

### 2. Roles and Permissions

- In the roles and permissions tab, there would be a left-side navigation bar where all the roles would be listed.
- By clicking on each role, their permission details will be shown on the right side of the screen in the form of checkboxes.
- The user will be able to update those permissions and save them by clicking on the save button below.
- In the top right corner, there is a “Create New Role” button. When the user clicks on that button, a modal will open, allowing the user to create a new role and assign permissions.

<hr>

### Settings

Under the settings tab, Merchant can change his password. He will provide his old password then he will provide his new password and confirm new password. If all the fields will be provided correct, the merchant password will be updated successfully.
<br>

### Developers Hub

Under the Developers Hub tab, Merchant can view his client key and client secret. He can also update his client secret by clicking "Generate New Secret" Button and his new client secret will be generated.
<br>
<hr>

## MicroServices Communication

<div align="center">
<a ref="https://github.com/Developers-Studio-Limited/Merchant-Service/blob/merchant_portal_backend/documents/assets/MicroServicesCommunication.jpg"  >
   <img src="https://github.com/Developers-Studio-Limited/Merchant-Service/blob/merchant_portal_backend/documents/assets/MicroServicesCommunication.jpg" width="700px" >
</a>
</div>

## Frontend

<details open>
<summary>Frontend</summary>

### Stack Used Frontend

- [VueJs (Front-End)](https://vuejs.org/)

## Installation Procedure Frontend

### Manual Installation

### Prerequisites

- Install Node<br>
  <a target="_blank" href="https://nodejs.org/en/download">Download Node</a> which one supported with system.

### Installation

<div id="installation"><div>

1. Clone the repository from git. <br />

```
https://github.com/Developers-Studio-Limited/Admin-Service/tree/dev_admin_frontend
```

2. Copy .env.example to .env <br />

```
cp .env.example .env
```

3. In env file update app environment and necessary URLs.

4. Run NPM Install <br />

```
npm run install
```

5. Run The Project<br />

```
npm run serve
```

### Installation via Docker

### Prerequisites

- Install Docker<br>
  <a target="_blank" href="https://www.docker.com/">Download Docker</a> which one supported with system.

1. Copy .env.example to .env <br />

```
cp .env.example .env
```

2. In env file update app environment and necessary URLs. <br />

3. Run NPM Install <br />

```
npm run install
```

4. Run Docker Compose Command

```
docker-compose up
```

## Directory Structure Frontend

```
root
|-- src (All source available here)
  |-- assets (Icon, images etc available here)
    |-- auth 
    |-- no_data_found
    |-- reports
    |-- upload_csv
  |-- components (All ccomponents used in ASL)
    |-- app (App level components)
    -- common (Common components)
    -- icons (Icon components)
    -- role_permissions (Role Permission components)
    -- users (User components)
  |-- constants 
  |-- js (Javascript Files)
    |-- helpers
  |-- router (ASL Routes)
  |-- services (Services used in ASL like API Service etc)
  |-- store
  |-- styles
    |-- auth
    |-- users
    |-- variables
  |-- views
    |-- activity_logs
    |-- auth
	|-- merchant
    |-- role_permissions
    |-- users
```

## Third Party Integrations Frontend

<!-- [Merchant Portal](https://) <br/> We used Merchant APIs to fetch, update and store data. -->

## External Packages Frontend

Following external packages are used:

1. [Quasar UI Framework](https://quasar.dev/) <br/> This framework is used for frontend development.

## Figma UI Link
Figma Link:  
(https://www.figma.com/file/21rorNXID71a0J9PDkXc6R/ASL---Design?node-id=6%3A72) 
</details>

<hr>

## Enviroments
Environment   | Configurations                                    | URL
--------      | -----------------                                 | ------ 
Development-Frontend           | Development environment of Merchant portal frontend | [Development URL](https://dev-merchant.developers.studio/)
Development-Backend          | Development environment of Merchant portal Backend  | [Development URL](https://dev-merchant.developers.studio/backend/)
