document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contestForm')) {
        // If this is the register contest page, add event listener for form submission
        document.getElementById('contestForm').addEventListener('submit', function(event) {
            event.preventDefault();
            createContest();
        });
    } else if (document.getElementById('contestListing')) {
        // If this is the join contest page, display available contests
        showContests();
    }
});

function createContest() {
    var prizePool = document.getElementById('prizePool').value;
    var spots = document.getElementById('spots').value;
    var prize1 = document.getElementById('prize1').value;
    var prize2 = document.getElementById('prize2').value;
    var prize3 = document.getElementById('prize3').value;
    var validTill = document.getElementById('validTill').value;
    var platform = document.getElementById('platform').value;
    var contestCode = document.getElementById('contestCode').value;

    // Saving contest details to localStorage
    var contest = {
        prizePool: prizePool,
        spots: spots,
        prize1: prize1,
        prize2: prize2,
        prize3: prize3,
        validTill: validTill,
        platform: platform,
        contestCode: contestCode
    };
    localStorage.setItem('contest_' + contestCode, JSON.stringify(contest));

    // Redirecting to the page for viewing contests
    window.location.href = 'join_contest.html';
}

function showContests() {
    clearExpiredContests(); // Clear expired contests before displaying

    var contestsDiv = document.getElementById('contestListing');
    contestsDiv.innerHTML = ''; // Clear previous contests

    var noContestMessage = '<p>No contests registered yet.</p>';

    // Get current time in milliseconds
    var currentTime = new Date().getTime();

    // Loop through localStorage to get all contests
    var hasContests = false;
    var contestCount = 0; // Variable to count registered contests
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith('contest_')) {
            var contest = JSON.parse(localStorage.getItem(key));
            var contestEndTime = new Date(contest.validTill).getTime();
            // Check if the contest is still valid (end time greater than current time)
            if (contestEndTime > currentTime) {
                var contestHTML = `
                    <div class="contest">
                        <p>Prize Pool: ${contest.prizePool}</p>
                        <p>Number of Spots: ${contest.spots}</p>
                        <p>First Prize: ${contest.prize1}</p>
                        <p>Second Prize: ${contest.prize2}</p>
                        <p>Third Prize: ${contest.prize3}</p>
                        <p>Valid Till: ${contest.validTill} (This contest will be automatically removed after 24 hours)</p>
                        <p>Platform: ${contest.platform}</p>
                        <p>Contest Code: <code>${contest.contestCode}</code></p>
                        <button onclick="joinContest(this, '${contest.contestCode}')">Copy Code</button>
                        <div class="copy-message">Copied</div>
                    </div>
                `;
                contestsDiv.insertAdjacentHTML('beforeend', contestHTML);
                hasContests = true;
                contestCount++; // Increment contest count
            } else {
                // Remove expired contest from localStorage
                localStorage.removeItem(key);
            }
        }
    }

    // If no contests available, display the message
    if (!hasContests) {
        contestsDiv.innerHTML = noContestMessage;
    }

    // Display the number of registered contests
    displayContestCount(contestCount);
}

function joinContest(button, contestCode) {
    // Copy contest code to clipboard
    navigator.clipboard.writeText(contestCode).then(function() {
        // Change button text to "Copied"
        button.textContent = 'Copied';

        // Disable the button after copying
        button.disabled = true;

        // Remove the disabled attribute after a certain duration
        setTimeout(function() {
            button.textContent = 'Join Contest';
            button.disabled = false;
        }, 2000); // 2000 milliseconds (2 seconds) timeout

        // Display the copied message
        var message = button.nextElementSibling; // Get the next sibling, which is the copy message
        message.style.display = 'block'; // Show the message

        // Hide the message after a certain duration
        setTimeout(function() {
            message.style.display = 'none'; // Hide the message
        }, 2000); // 2000 milliseconds (2 seconds) timeout
    }, function(err) {
        // Error handling
        console.error('Unable to copy contest code: ', err);
    });
}

function clearExpiredContests() {
    // Get current time in milliseconds
    var currentTime = new Date().getTime();

    // Loop through localStorage to check and remove expired contests
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith('contest_')) {
            var contest = JSON.parse(localStorage.getItem(key));
            var contestEndTime = new Date(contest.validTill).getTime();
            // Check if the contest is expired
            if (contestEndTime <= currentTime) {
                localStorage.removeItem(key);
            }
        }
    }
}

function displayContestCount(count) {
    var countElement = document.getElementById('contestCount');
    countElement.textContent = count;
}

function updateContestCount() {
    var contestCount = 0;

    // Loop through localStorage to count registered contests
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith('contest_')) {
            contestCount++;
        }
    }

    // Display the updated count
    displayContestCount(contestCount);
}

// Call updateContestCount initially to display the count on page load
updateContestCount();
