document.addEventListener("DOMContentLoaded", () => {
  init();
});

const init = () => {
  //TODO remove below
  // window.testPollObj = {
  //   title: "Pineapple",
  //   question: "Does pineapple belong on pizza?",
  //   optionsObjArr: [
  //     {
  //       optionStr: "yes",
  //       voteCount: 2
  //     },
  //     {
  //       optionStr: "no",
  //       voteCount: 5
  //     },
  //     {
  //       optionStr: "maybe",
  //       voteCount: 3
  //     },
  //     {
  //       optionStr: "not a chance in hell",
  //       voteCount: 10
  //     }
  //   ]
  // };
  // displayPollForm(window.testPollObj);
  //TODO remove above
  bindEvents();
};

const bindEvents = () => {
  document
    .getElementById("createPoll")
    .addEventListener("submit", handleCreatePoll);
  document
    .getElementById("randomPollBtn")
    .addEventListener("click", handleRandomPoll);
  document
    .getElementById("selectPollBtn")
    .addEventListener("click", handlePollSearch);
};

const getPoll = async (pollTitle) => {
  if (pollTitle) {
    response = await axios.get(`http://localhost:3001/poll/singlePoll/${pollTitle}`);
  } else {
    alert('please enter a title')
  }
  console.log(response)
  displayPollForm(response.data[0])
};

const handleCreatePoll = e => {
  e.preventDefault();
  let pollObj = {};
  let optionsObjArr = [];
  for (let i = 0; i < e.target.length - 1; i++) {
    if (e.target[i].name === "option") {
      optionsObjArr.push({
        optionStr: e.target[i].value,
        voteCount: 0
      });
    } else {
      pollObj[e.target[i].name] = e.target[i].value;
    }
  }
  pollObj.optionsObjArr = optionsObjArr;
  console.log(pollObj);
  // document.getElementById('createPoll', ).value = '';
  postPoll(pollObj)
};

const postPoll = async (pollObj) => {
  const resolved = await axios.post("http://localhost:3001/poll/createPoll", {
    pollObj: pollObj
  }).catch((err) => {
    throw 'There was a problem making your request'
  });
  console.log(resolved)
}

const handlePollSearch = e => {
  let titleStr = "";
  titleStr = document.getElementById("selectPollTitle").value;
  getPoll(titleStr);
};

const handleRandomPoll = async (e) => {
  let pollObj = await getRandomPoll();
  displayPollForm(pollObj.data[0]);
};

const getRandomPoll = async () => {
  return await axios.get("http://localhost:3001/poll/randomPoll");
}

const handleVote = e => {
  e.preventDefault();
  let voteResults = {};
  voteResults.pollTitle = e.target[0].name;
  for (let i = 0; i < e.target.length - 1; i++) {
    if (e.target[i].checked) {
      voteResults.votedIndex = e.target[i].value;
    }

  }

  putPoll(voteResults.pollTitle, voteResults.votedIndex)
};

const putPoll = async (titleStr, pollIndex) => {
  console.log(titleStr)
  console.log(pollIndex);
  let response = await axios.put(`http://localhost:3001/poll/vote/${titleStr}`, {
    pollIndex: pollIndex
  });
  console.log(response.data);
  displayPollResults(response.data);
}

const displayPollForm = pollObj => {
  let containerDiv = document.getElementById("displayPollContainer");
  containerDiv.innerHTML = "";
  let h2 = document.createElement("h2");
  h2.innerText = pollObj.title;
  containerDiv.append(h2);
  let p = document.createElement("p");
  p.innerText = pollObj.question;
  containerDiv.append(p);
  let form = document.createElement("form");
  form.setAttribute("id", "voteCountForm");
  for (let i = 0; i < pollObj.optionsObjArr.length; i++) {
    let inputItem = document.createElement("input");
    inputItem.setAttribute("type", "radio");
    inputItem.setAttribute("name", pollObj.title);
    inputItem.setAttribute("value", i);
    form.append(inputItem);
    form.append(pollObj.optionsObjArr[i].optionStr);
    let br = document.createElement("br");
    form.append(br);
  }
  let buttonItem = document.createElement("button");
  buttonItem.innerText = "Vote!";
  form.append(buttonItem);
  form.addEventListener('submit', handleVote)
  containerDiv.append(form);
};
//<div id="displayPollContainer">
// <h2>Pineapple</h2>
// <p>Does pineapple belong on pizza</p>
// <form id="voteCountForm">
//   <input type="radio" name="vote" value="0">yes</br>
//   <input type="radio" name="vote" value="1">no</br>
//   <input type="radio" name="vote" value="2">maybe</br>
//   <input type="radio" name="vote" value="3">not a chance in hell</br>
//   <button type="submit">Vote!</button>
// </form>
//</div>
const displayPollResults = pollObj => {
  let containerDiv = document.getElementById("displayPollContainer");
  containerDiv.innerHTML = "";
  let h2 = document.createElement("h2");
  h2.innerText = pollObj.title;
  containerDiv.append(h2);
  let p = document.createElement("p");
  p.innerText = pollObj.question;
  containerDiv.append(p);
  for (let i = 0; i < pollObj.optionsObjArr.length; i++) {
    let optionAndVoteP = document.createElement("p");
    optionAndVoteP.innerText = `${pollObj.optionsObjArr[i].voteCount} - ${
        pollObj.optionsObjArr[i].optionStr
      }`;
    containerDiv.append(optionAndVoteP);
    let br = document.createElement("br");
    containerDiv.append(br);
  }
};