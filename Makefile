# tools
NPM_BIN:=$(shell npm bin)
BASH_ROLLUP:=$(NPM_BIN)/bash-rollup
CATALYST_SCRIPTS:=$(NPM_BIN)/catalyst-scripts
# common/meta source
PKG_FILES:=package.json package-lock.json
# bash cli vars
CLI_SRC:=src/cli/index.sh $(shell find src/cli -name "*.sh" -not -path "src/cli/index.sh")
CLI_BIN:=dist/git-report.sh
# JS reporter vars
REPORTER_SRC_DIR=src/reporter
REPORTER_SRC:=$(REPORTER_SRC_DIR)/index.js $(shell find src/reporter -name "*.js" -not -path "src/reporter/index.js")
REPORTER_BIN:=dist/reporter.js
# define total output
DIST_FILES:=$(CLI_BIN) $(REPORTER_BIN)

$(CLI_BIN): $(CLI_SRC) $(PKG_FILES)
	mkdir -p dist
	$(BASH_ROLLUP) $< $@

$(REPORTER_BIN): $(REPORTER_SRC) $(PKG_FILES)
	mkdir -p dist
	# JS_FILE="$<" JS_OUT="$@" JS_FORMAT='es' $(CATALYST_SCRIPTS) build
	JS_FILE="$<" JS_OUT="$@" $(CATALYST_SCRIPTS) build

# Makefile settings and meta targets
build: $(DIST_FILES)

clean:
	rm -f $(DIST_FILES)
	
lint:
	JS_SRC=$(REPORTER_SRC_DIR) $(CATALYST_SCRIPTS) lint

lint-fix:
	JS_SRC=$(REPORTER_SRC_DIR) $(CATALYST_SCRIPTS) lint-fix

# support traditional 'make all' target for 'build'
all: build

.DEFAULT_GOAL:=build

.DELETE_ON_ERROR:

.PHONY: all build clean lint lint-fix
