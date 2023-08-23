<a ref="https://github.com/Developers-Studio-Limited/Agent-Service-Backend/blob/agent_pre_production_backend/documents/assets/asl.png"  >
   <img src="https://github.com/Developers-Studio-Limited/Agent-Service-Backend/blob/agent_pre_production_backend/documents/assets/asl.png"  width="200px" align="right">
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

# Agent Portal:
One of the modules of the AML project is the agent portal. It allows the agent to add sources from which the crawler will scrape data. The agent can also generate manual reports, can set the crawling priority of the source. This service provides the fundamental functions of user management, report generation, system log management, and so on.

<hr>

### Project Overview - Explanation of Buisness Idea

### Buisness Document Link

https://drive.google.com/file/d/1g11wmVbtvzcUOO7hXErSLp6y49jBPutG/view?usp=sharing

### SRS Document Link

https://drive.google.com/file/d/1sbVVmK48AKPmawEALbYg9xH3WB-QS4qo/view?usp=sharing

<hr>

### The agent portal will have 4 main tabs:

1. Sources
2. Reports
3. User Management
4. Activity Logs

### Sources:

- On the main screen, all the sources would be listed under the source tab, with an "add source" button in the upper right corner. By pressing the "add source" button, the agent will be able to add a new source. To add the new source, the user must first fill out the relevant data and then click the save button.
- There will be a button on the "add source" form that the user can click to add new custom fields. Two icons will be displayed: update source and schedule source priority.

 <ul>
 * Update Source: The Update Source dialogue box will appear, allowing the user to change and update any field.
 <br>
 * Schedule Source Priority: When user clicks the "Schedule Priority" icon, there will appear a dialog from where user can set the priority of the source.
 </ul>
 
  * The user can also upload a CSV file to add the source. We have an upload CSV button to the left of the add source button. After hitting that button, a dialogue box will appear, allowing the user to upload the CSV file.
  
  * Smart filters will be there.

<hr>

### Reports:

- All reports would be shown in the form of cards on the main page under the Reports tab, including the person's photograph, name, DOB, and country.
- When you click the card, a new web page will appear with all of that person's details, as well as a "Download PDF" button in the top right corner. The user might also download the report in pdf format.
- In the top right corner, there is an "add new report" button, and to the left of that button is a search bar where the user can search all of the added reports.
- When the user clicks the "Add New Report" button, a form appears, allowing them to manually add reports by filling in the required fields.
- Custom fields can also be added by the user.
- Smart filters will be there.
- In addition to that, users will also be able to edit the report at any time.

<hr>

### User Management

Under the user management tab, we’ll have two sub-tabs:

1. All Users
2. Roles and Permissions

#### 1. All Users

- All the users would be shown in the list view with all their details. Two icons will be displayed: Edit Role and View Details

- Edit Role: The Edit Role dialogue box will appear, allowing the user to change and update any field.

- View Details: When you click the "view details" icon, all of the user’s other details will be displayed.

- All the users would be shown in the list view, with all their details. Two icons will be displayed: Edit Role and View Details
- When the user clicks the "Create User" button, a form appears, allowing them to create a new user by filling in the required fields.

### Invite new users:

The Admin can send invites to new users. The admin will provide the email and role of that user, and an invite link will be sent to that email. After clicking the link in the email, the user will set up his basic details and password and can access the Agent Backoffice.
<br>
There will be a login screen where agents can enter their credentials and log in.

<hr>

### 2. Roles and Permissions

- In the roles and permissions tab, there would be a left-side navigation bar where all the roles would be listed.
- By clicking on each role, their permission details will be shown on the right side of the screen in the form of checkboxes.
- The user will be able to update those permissions and save them by clicking on the save button below.
- In the top right corner, there is a “Create New Role” button. When the user clicks on that button, a modal will open, allowing the user to create a new role and assign permissions.

<hr>

### Activity Logs:

Admin will be able to view activities being performed by users on the agent portal platform.

<br>

## MicroServices Communication

<div align="center">
<a ref="https://github.com/Developers-Studio-Limited/Agent-Service-Backend/blob/agent_pre_production_backend/documents/assets/MicroServicesCommunication.jpg"  >
   <img src="https://github.com/Developers-Studio-Limited/Agent-Service-Backend/blob/agent_pre_production_backend/documents/assets/MicroServicesCommunication.jpg" width="700px" >
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
https://github.com/Developers-Studio-Limited/Agent-Service-Frontend/
```

2. Copy .env.example to .env <br />

```
cp .env.example .env
```

3. In env file update app environment and necessary URLs. <br />

4. Run NPM Install <br />

```
npm run install
```

5. Run The Project <br />

```
npm run serve
```

### Installation via Docker

### Prerequisites

- Install Docker<br>
  <a target="_blank" href="https://www.docker.com/">Download Docker</a> which one supported with system.

2. Copy .env.example to .env <br />

```
cp .env.example .env
```

3. In env file update app environment and necessary URLs. <br />

4. Run NPM Install <br />

```
npm run install
```

5. Run Docker Compose Command

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
    -- reports (Report components)
    -- role_permissions (Role Permission components)
    -- source (Source components)
    -- users (User components)
  |-- constants 
  |-- js (Javascript Files)
    |-- helpers
  |-- router (ASL Routes)
  |-- services (Services used in ASL like API Service etc)
  |-- store
  |-- styles
    |-- auth
    |-- reports
    |-- users
    |-- variables
  |-- views
    |-- activity_logs
    |-- auth
    |-- reports
    |-- role_permissions
    |-- source
    |-- users
```

## Third Party Integrations Frontend

<!-- [Agent Portal](https://) <br/> We used Agent APIs to fetch, update and store data. -->

## External Packages Frontend

Following external packages are used:

1. [Quasar UI Framework](https://quasar.dev/) <br/> This framework is used for frontend development.

## Figma UI Link
Figma Link:  
(https://www.figma.com/file/21rorNXID71a0J9PDkXc6R/ASL---Design?node-id=0%3A1) 
</details>

<hr>

## Enviroments
Environment   | Configurations                                    | URL
--------      | -----------------                                 | ------ 
Development-Frontend           | Development environment of Agent portal frontend | [Development URL](https://dev-agent.developers.studio/)
Development-Backend          | Development environment of Agent portal Backend  | [Development URL](https://dev-agent.developers.studio/backend/)
