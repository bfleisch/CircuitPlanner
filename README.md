# Circuit Planner

Tools for configuring FLARM devices and generating flight task files for gliding.

**License:** MIT

## Core Capabilities

- Create and edit glider flight circuits using an interactive map and waypoint database.
- Edit device parameters through a web-based interface.
- Export updated configurations for use with FLARM hardware.
- Export tasks as `.tsk` files for XCSoar or as `flarmcfg.txt` for FLARM devices.
- Generate `.cup` files compatible with Oudie devices and SeeYou for flight task transfer.

## Building a Static Export

To generate a static export of this project:

```bash
npm run export
```

The static site will be output to the `out/` directory. Deploy the contents of this directory to any static web server of your choice.