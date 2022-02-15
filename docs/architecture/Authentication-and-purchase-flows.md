# Authentication and purchase flows flows

## Authentication flow

The customer must authenticate via Firebase Authentication, from the app, in order to initiate a purchase via Account Based Ticketing. The same login credentials can be used from both web and app, so if a user already exists, then the same data is accessible from all platforms.

### New user

The first time a user logs in we create a Firebase Auth user. This user is specific to our APIs. After the Firebase Auth user is created, we have to create a customer as well as as an account in the Entur backend. The IDs of the Entur entities are synchronized back to our Firebase Auth user.

```mermaid
sequenceDiagram
participant A as App
participant F as Firebase
participant AB as Our Backend (GCP)
participant EB as Entur Backend (GCP)
Note left of A: AuthContext: Customer logs in anonymously <br> or with phone number for the first time
A->>F: App invokes auth via <br> Firebase Auth SDK
F-->+AB: Cloud Function triggers <br> when user is created
AB->>+EB: Create a new Customer
Note right of EB: Create a new customer <br> in Sales API
EB->>-AB: Return customer info
AB->>+EB: Create ABT account
Note right of EB: Create a new account in ABT <br> with Sales API customer_number
EB->>-AB: Return account information
AB->>-F: Update claims
Note over AB,F: Updates Firebase Auth user with <br> customer_number, and ABT account id
F-->A: Updated user with claims <br> are synced with <br> customer_number and abt_id
Note left of A: Customer can now initiate a ABT purchase flow
```

### Existing user

If we already have an existing user, we do not have to trigger any extra operations beyond communicating with Firebase Auth in order to log in.

```mermaid
sequenceDiagram
participant A as App
participant F as Firebase
Note left of A: AuthContext: Customer logs in anonymously <br> or with phone number for the first time
A->>F: App invokes auth via <br> Firebase Auth SDK
Note right of F: The user already exists with correct claims <br> Cloud Function is not triggered
F-->A: Updated user with claims <br> are synced with <br> customer_number and abt_id
Note left of A: Customer can now initiate a ABT purchase flow
```

## Purchase flow and ticket synchronization

The customer must be authenticated in order to initiate a purchase or sync previously purchased fare contracts

- FareContract: An order in the Account Based Ticketing, containing one or more travel rights (translated from Customer Purchase Package)
- Travel Right: An entity which can loosely be compared to a ticket, which gives a customer a right to travel by some means of transportation.

### Ticket synchronization

When opening the app, and the Firebase Auth user has been synced, we then query a Firestore collection specific to the user in order to retrieve their tickets (fare contracts containing travel rights).

```mermaid
sequenceDiagram
participant A as App
participant F as Firebase
Note left of A: All tickets are synced in TicketContext,<br>by using the Firestore SDK
A->>+F: Query Firestore for all FareContracts<br> belonging to a certain ABT account id
Note right of F: All FareContracts are cached in Firestore,<br>including active, expired and refunded.<br>Fare Contracts contains one or more Travel Rights.
F->>-A: All fare contracts returned
```

### Purchase flow

```mermaid
sequenceDiagram
participant A as App
participant F as Firebase
participant AB as Our Backend (GCP)
participant EB as Entur Backend (GCP)
A->>+AB: Search for offers, based on parameters<br>selected in Offer-screen
Note left of A: Offer-screen: Customer selects product,<br>travellers and travel zones
AB->>+EB: Calls /offers/search/zones
Note right of AB: Ticket-service
Note right of EB: Offer API
EB-->-AB: Offers returned from Entur
AB-->-A: Offer returned to app
Note left of A: Confirmation-screen: Customer accepts<br>offer and selects payment method
A->>+AB: Customer reserves offer with selected payment method
AB->>+EB: Several calls
Note over AB,EB: Ticket-service does several<br>calls to Sales API here:<br>1. Create order<br>2.Create payment<br>3.Create transaction
EB->>-AB: If all calls succeed
AB-->F: Create reservation in<br>Firestore for user
AB->>-A: Offer reserved, return order_id, payment_id,<br>transaction_id and payment terminal URL to app
Note left of A: At this point the customer pays with selected<br>payment method. In this example it is creidt card
Note over A: Customer completes payment in WebView for credit card
A->>+AB: WebView navigates to callback-URL on Ticket-service
AB->>+EB: Capture payment
Note right of EB: NETS is called behind-the-scenes
EB->>-AB: If successful
AB->>-A: Callback redirects to deep-link URL in app<br>which navigates to the TicketOverview-screen
Note over A: Customer waits in TicketOverview-screen<br>until Fare Contract is issued
F-->A: Previously created Firestore-reservation<br>is shown in overview-screen until fare contract is issued
loop Fare Contract queue
    EB->>EB: After payment capture the<br>fare contract is issued asynchronously<br>via a Kafka-queue
end
EB-->AB: Our backend listens<br>to the FareContract-queue
Note over AB: Cloud Function is called<br>when queue updates
AB-->F: Fare contracts are synced to Firestore
F-->A: App listens to Firestore aand syncs fare contracts
Note over A: Ticket is displayed in overview screen,<br>reservation is removed from screen
```
