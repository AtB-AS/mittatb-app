import {spawn} from 'child-process-promise';

export default async function setLocation(latitude: number, longitude: number) {
  // Run this command in shell.
  // Every argument needs to be a separate string in an an array.
  const command = 'applesimutils';
  const args = ['--setLocation', `"[${latitude}, ${longitude}]"`];
  const options = {
    shell: true,
  };

  await spawn(command, args, options);
}
