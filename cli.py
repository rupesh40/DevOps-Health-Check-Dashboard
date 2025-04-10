import argparse  # argparse: Built-in library for building command-line tools
from app.storage import load_services, save_services


def add_service(name, url):
    services = load_services()
    services.append({"name": name, "url": url})
    save_services(services)
    print(f" Added: {name} ({url})")


def list_services():
    services = load_services()
    if not services:
        print("No services added yet.")
        return

    print("Monitored Services:")
    for idx, svc in enumerate(services, 1):
        print(f"{idx}, {svc['name']} - {svc['url']}")


def main():
    parser = argparse.ArgumentParser(description="DevOps Health Check CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a service to monitor")
    add_parser.add_argument("name", help="Service name")
    add_parser.add_argument("url", help="Service URL")

    # List command
    subparsers.add_parser("list", help="List monitored services")

    args = parser.parse_args()

    if args.command == "add":
        add_service(args.name, args.url)
    elif args.command == "list":
        list_services()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
