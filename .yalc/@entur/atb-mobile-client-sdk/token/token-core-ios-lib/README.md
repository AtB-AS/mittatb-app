# iOS AbtTokenCoreSDK

## Development

### Toolchain

This project requires `Homebrew` and `Mint`. In order to install the required tools, please run the following command

    sh bootstrap.sh

for Arm64 based arch

    sh bootstrap-arm64.sh

> It will install required tools and `Packages` in the `Mintfile`.

### Commands while developing

Format code

    mint run swiftformat .

Lint issues

    mint run swiftlint --fix .

## Protobuf contracts

Generation of Swift-code depends on [SwiftProtobuf](https://github.com/apple/swift-protobuf) installed locally. Easiest way is to run `brew install swift-protobuf`.

Then you can generate Swift-code from the protobuf-contracts inside the folder where the `.proto` files are by running:

```bash
rm -rf $OUTPUT_FOLDER && mkdir $OUTPUT_FOLDER
protoc --swift_out=$OUTPUT_FOLDER ./**/*.proto
```

If files are removed or added, you'll have to go under the `AbtTokenCoreSDK/swift-proto` and update files there and Xcode project structure, so for that reason is recommended to do this procedure in Xcode directly.