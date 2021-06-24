# Builds everything in the universe.
env-nfk:
	$(info Copying .env.nfk to main .env)
	cp .env .env.last;
	cp .env.nfk .env;

env-atb:
	$(info Copying .env.atb to main .env)
	cp .env .env.last;
	cp .env.atb .env;

clean-all:
	$(info Cleaning app artifacts ...)
	yarn clean;

	$(info Deleting the build folder for ios and android...)
	rm -rf ios/ios/build;
	rm -rf android/app/build;

#TODO:
# Must create script to copy correct env files and GooglePlayServices files to right env directories