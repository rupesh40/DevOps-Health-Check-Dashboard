How It Works
On Push to Main:

Runs all tests (must pass)

Builds Docker image with 2 tags (latest and commit SHA)

Pushes to Docker Hub

SSH into production server and runs deploy.sh

On Pull Request:

Only runs tests (no deployment)

Free Tier Usage Estimate
Activity	Time/Job	Free Tier Allowance	Capacity
Test Jobs	3 mins	2,000 mins/month	~650 runs
Deploy Jobs	6 mins		~330 deploys
Docker Hub	-	Unlimited public	No limits
