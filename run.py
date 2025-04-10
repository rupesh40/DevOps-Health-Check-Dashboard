from app.api import app
#from app.scheduler import start_scheduler

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
   # start_scheduler()  # Start the periodic checker in the background. only use it for monolithic services
