function Pickaxe()
{
    // CONFIGURATION
    var ironIngotsType = '0x1BEF';
    var woodenLogsType = '0x1BDD';
    var pickaxeType = '0x0E85';
    var itemColor = '0xFFFF';

    var ironIngotsNeeded = 200;
    var woodenLogsNeeded = 50;
    var pickaxesPerBatch = 30;

    // REPLENISHMENT THRESHOLDS
    var ironReplenishThreshold = 10;
    var logsReplenishThreshold = 5;

    // FIXED MATERIAL CONTAINERS
    var ironContainer = '0x401CD5F8';
    var logsContainer = '0x402FE8E0';

    // SELECT PICKAXE DESTINATION AT STARTUP
    Orion.Print('Target the container for finished pickaxes.');
    Orion.AddObject('pickaxeDestination');

    if (!Orion.WaitForAddObject('pickaxeDestination', 30000)) {
        Orion.Print('No destination selected. Stopping.');
        return;
    }

    var pickaxeDestination = Orion.GetSerial('pickaxeDestination');

    if (!pickaxeDestination || pickaxeDestination === '0x00000000') {
        Orion.Print('Invalid destination container. Stopping.');
        return;
    }

    Orion.Print('Pickaxe destination: ' + pickaxeDestination);

    // COLLECT MATERIALS FROM A CONTAINER
    function collectMaterial(graphic, requiredAmount, container)
    {
        var currentAmount = Orion.Count(graphic, itemColor, 'backpack');
        var amountNeeded = requiredAmount - currentAmount;

        if (amountNeeded <= 0) {
            return true;
        }

        Orion.Print('Collecting material: ' + graphic);

        Orion.OpenContainer(container);
        Orion.Wait(1000);

        var items = Orion.FindType(graphic, itemColor, container);

        for (var i = 0; i < items.length; i++) {
            if (amountNeeded <= 0) {
                break;
            }

            var item = Orion.FindObject(items[i]);

            if (item === null) {
                continue;
            }

            var stackAmount = item.Count();
            var moveAmount = Math.min(stackAmount, amountNeeded);

            if (moveAmount <= 0) {
                continue;
            }

            Orion.MoveItem(items[i], moveAmount, 'backpack');
            Orion.Wait(1200);

            currentAmount = Orion.Count(graphic, itemColor, 'backpack');
            amountNeeded = requiredAmount - currentAmount;
        }

        currentAmount = Orion.Count(graphic, itemColor, 'backpack');

        if (currentAmount < requiredAmount) {
            Orion.Print(
                'Insufficient material ' + graphic +
                '. Required: ' + requiredAmount +
                ', available: ' + currentAmount
            );
            return false;
        }

        Orion.Print('Material replenished: ' + currentAmount);
        return true;
    }

    // CHECK WHETHER THE DESTINATION CONTAINER IS FULL
    function destinationIsFull()
    {
        return Orion.InJournal('That container is full');
    }

    // DEPOSIT A BATCH OF PICKAXES
    function depositPickaxes()
    {
        var pickaxes = Orion.FindType(
            pickaxeType,
            itemColor,
            'backpack'
        );

        if (pickaxes.length < pickaxesPerBatch) {
            return false;
        }

        Orion.Print('Depositing ' + pickaxesPerBatch + ' pickaxes.');

        for (var i = 0; i < pickaxes.length && i < pickaxesPerBatch; i++) {
            if (destinationIsFull()) {
                return false;
            }

            Orion.MoveItem(pickaxes[i], 1, pickaxeDestination);
            Orion.Wait(700);
        }

        Orion.Wait(1000);
        return !destinationIsFull();
    }

    // CRAFT ONE PICKAXE
    function craftOnePickaxe()
    {
        Orion.UseType('0x1BEF');

        if (!Orion.WaitForMenu(3000)) {
            Orion.Print('Crafting menu did not open. Retrying.');
            Orion.Wait(1500);
            return false;
        }

        var menu0 = Orion.GetMenu('last');

        if (menu0 === null || menu0.Name() !== 'Blacksmithing') {
            Orion.Print('Blacksmithing menu not detected.');
            return false;
        }

        menu0.Select('Tools');

        if (!Orion.WaitForMenu(3000)) {
            Orion.Print('Tools menu did not open.');
            return false;
        }

        var menu1 = Orion.GetMenu('last');

        if (menu1 === null || menu1.Name() !== 'Tools') {
            Orion.Print('Tools menu not detected.');
            return false;
        }

        menu1.Select('Pick axe');
        Orion.Wait(1500);

        return true;
    }

    // INITIAL MATERIAL COLLECTION
    Orion.Print('Collecting Iron Ingots...');

    if (!collectMaterial(
        ironIngotsType,
        ironIngotsNeeded,
        ironContainer
    )) {
        Orion.Print('Stopped: insufficient Iron Ingots.');
        return;
    }

    Orion.Print('Collecting Wooden Logs...');

    if (!collectMaterial(
        woodenLogsType,
        woodenLogsNeeded,
        logsContainer
    )) {
        Orion.Print('Stopped: insufficient Wooden Logs.');
        return;
    }

    Orion.Print('Materials collected successfully.');
    Orion.Print('Starting pickaxe production.');

    var craftedSinceStart = 0;

    // MAIN CRAFTING LOOP
    while (true) {
        if (destinationIsFull()) {
            Orion.Print('Destination container is full. Stopping.');
            return;
        }

        // REPLENISH IRON BEFORE OPENING THE CRAFTING MENU
        var currentIron = Orion.Count(
            ironIngotsType,
            itemColor,
            'backpack'
        );

        if (currentIron < ironReplenishThreshold) {
            Orion.Print('Iron below 10. Replenishing Iron Ingots...');

            if (!collectMaterial(
                ironIngotsType,
                ironIngotsNeeded,
                ironContainer
            )) {
                Orion.Print('Stopped: unable to replenish Iron Ingots.');
                return;
            }
        }

        // REPLENISH LOGS BEFORE OPENING THE CRAFTING MENU
        var currentLogs = Orion.Count(
            woodenLogsType,
            itemColor,
            'backpack'
        );

        if (currentLogs < logsReplenishThreshold) {
            Orion.Print('Logs below 5. Replenishing Wooden Logs...');

            if (!collectMaterial(
                woodenLogsType,
                woodenLogsNeeded,
                logsContainer
            )) {
                Orion.Print('Stopped: unable to replenish Wooden Logs.');
                return;
            }
        }

        // DEPOSIT EACH COMPLETE BATCH
        var currentPickaxes = Orion.Count(
            pickaxeType,
            itemColor,
            'backpack'
        );

        if (currentPickaxes >= pickaxesPerBatch) {
            if (!depositPickaxes()) {
                Orion.Print('Deposit failed or destination is full.');
                return;
            }

            continue;
        }

        // CRAFT THE NEXT PICKAXE
        var previousCount = currentPickaxes;

        if (!craftOnePickaxe()) {
            Orion.Wait(1000);
            continue;
        }

        Orion.Wait(1000);

        currentPickaxes = Orion.Count(
            pickaxeType,
            itemColor,
            'backpack'
        );

        if (currentPickaxes > previousCount) {
            craftedSinceStart += currentPickaxes - previousCount;

            Orion.Print(
                'Pickaxes crafted this run: ' + craftedSinceStart
            );
        }
    }
}