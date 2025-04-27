using CarthageLink.Server.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

public class SensorHub : Hub
{
    private readonly ISensorDataRepository _sensorRepo;

    public SensorHub(ISensorDataRepository sensorRepo)
    {
        _sensorRepo = sensorRepo;
    }

    public override async Task OnConnectedAsync()
    {
        var role = Context.GetHttpContext()?.Request.Query["role"].ToString();

        if (role == "SuperAdmin")
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SuperAdmin");
        }

        await base.OnConnectedAsync();
    }

    public async Task SubscribeToDevice(string deviceId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, deviceId);
        var data = await _sensorRepo.GetLatestByDeviceId(deviceId);
        await Clients.Caller.SendAsync("ReceiveData", data);
    }

    public async Task UnsubscribeFromDevice(string deviceId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, deviceId);
    }

    public async Task SendNotificationToSuperAdmin(string message)
    {
        await Clients.Group("SuperAdmin").SendAsync("ReceiveNotification", message);
    }
}
